import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { adsPerCategory } from '@services/category'
import { useStore } from '@zustand/store'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useQuery } from 'react-query'

function Category() {
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const { name, params } = useRoute()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const {
    isLoading,
    isFetching,
    data: ads,
    // refetch,
  } = useQuery(`${name}-ads`, () => adsPerCategory(page, params?.category), {
    notifyOnChangeProps: 'tracked',
    onSuccess: (data) => setList((list) => [...list, ...data.data]),
  })

  useEffect(() => {
    console.log('mounted ')
    console.log('CurrentName', name)
    console.log('Passed params', params)
  }, [])
  const loading = isFetching || isLoading
  const hasMore = page < ads?.page

  const handleEndReached = () => {
    if (hasMore) setPage(page + 1)
  }
  const Headercom = () => (
    <View style={styles.sortContainer}>
      <IconButton
        icon='filter-outline'
        color={colors.text}
        size={30}
        onPress={() => console.log('Toggle the sort menu')}
      />
    </View>
  )
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {page === 1 && loading ? (
          <Loader />
        ) : (
          <FlatList
            style={{ flex: 1, width: '100%' }}
            data={list}
            renderItem={(itemData) => <Preview {...itemData.item} />}
            keyExtractor={(item) => item.id}
            ListFooterComponent={hasMore ? Loader : null}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={Headercom}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text }}>No ads yet.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

export default Category
