import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import SelectedOption from '@components/SelectedOption'
import SortOptionsModal from '@components/SortOptionModal'
import { sortOptions } from '@constants/common'
import { extractRgbComponents } from '@constants/style'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { adsPerCategory } from '@services/category'
import { useStore } from '@zustand/store'
import { useEffect, useState } from 'react'
import {
  FlatList,
  LayoutAnimation,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useQuery } from 'react-query'

function Category() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [sort, setSort] = useState('createdAt,DESC')
  const { name, params } = useRoute()
  const { colors, dark } = useTheme()
  const navigation = useNavigation()

  const { blue, green, red } = extractRgbComponents(
    dark ? colors.border : colors.background,
  )
  const {
    isLoading,
    isFetching,
    data: ads,
    refetch,
  } = useQuery(
    `${name}-ads`,
    () => adsPerCategory(page, params?.category, sort),
    {
      onSuccess: (data) => {
        setHasMore(page < data?.pageCount)
        setList((list) => [...list, ...data.data])
      },
    },
  )

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setSort(option)
    setIsOpen(false)
  }

  useEffect(() => {
    setList([])
    if (page !== 1) {
      setPage(1)
    } else {
      refetch()
    }
  }, [sort])

  useEffect(() => {
    refetch()
  }, [page])

  const loading = isFetching || isLoading

  const handleEndReached = () => {
    if (hasMore) {
      setPage(page + 1)
    }
  }
  const Headercom = () => (
    <View style={styles.sortContainer}>
      <View
        style={{
          backgroundColor: `rgba(${red},${green},${blue},1)`,
          borderRadius: 20,
          padding: 2,
        }}
      >
        <IconButton
          icon='swap-vertical-outline'
          color={colors.text}
          size={20}
          onPress={handleToggleDropdown}
          text='Sort'
        />
      </View>
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
            ListFooterComponent={hasMore || loading ? Loader : null}
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
      <SortOptionsModal
        isOpen={isOpen}
        toggleFunc={() => setIsOpen(!isOpen)}
        currentSelection={sort}
        handleSelection={handleOptionSelect}
      />
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
