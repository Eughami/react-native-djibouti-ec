import FilterDrawer from '@components/FilterDrawer'
import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import SortOptionsModal from '@components/SortOptionModal'
import { sortOptions } from '@constants/common'
import { ROUTES } from '@constants/routes'
import { extractRgbComponents } from '@constants/style'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useTheme } from '@react-navigation/native'
import { searchAds } from '@services/search'
import { useStore } from '@zustand/store'
import { useEffect, useState } from 'react'
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { useQuery } from 'react-query'
// TODO. Add a way to not make a request initially and only make it when search/filters/sort are updated

const Drawer = createDrawerNavigator()

function Search({ navigation }) {
  const { colors, dark } = useTheme()
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const [sort, setSort] = useState(sortOptions[0])
  const [isOpen, setIsOpen] = useState(false)

  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])

  const { blue, green, red } = extractRgbComponents(
    dark ? colors.border : colors.background,
  )
  const [inputText, setInputText] = useState('')

  const {
    isLoading,
    isFetching,
    data: ads,
    refetch,
  } = useQuery('search-ads', () => searchAds(page, filters, sort.value), {
    enabled: false,
    onSuccess: (data) => {
      setHasMore(page < data?.pageCount)
      setList((list) => [...list, ...data.data])
    },
  })

  useEffect(() => {
    setList([])
    console.log('Filters updated: ', filters)
    console.log('sort updated: ', sort)
    if (page !== 1) {
      setPage(1)
    } else {
      refetch()
    }
  }, [sort, filters])

  useEffect(() => {
    refetch()
  }, [page])

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setSort(option)
    setIsOpen(false)
  }

  const handleEndReached = () => {
    if (hasMore) {
      setPage(page + 1)
    }
  }

  const loading = isLoading || isFetching
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
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
          stickyHeaderHiddenOnScroll
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <>
              <View style={styles.sortContainer}>
                <View
                  style={[
                    styles.iconButtonContainer,
                    {
                      backgroundColor: `rgba(${red},${green},${blue},1)`,
                    },
                  ]}
                >
                  <IconButton
                    icon='swap-vertical-outline'
                    color={colors.text}
                    size={20}
                    onPress={handleToggleDropdown}
                    // TODO.
                    text={sort.label || 'Sort'}
                  />
                </View>
                <View
                  style={[
                    styles.iconButtonContainer,
                    {
                      backgroundColor: `rgba(${red},${green},${blue},1)`,
                    },
                  ]}
                >
                  <IconButton
                    icon='funnel-outline'
                    color={colors.text}
                    size={20}
                    onPress={() => navigation.toggleDrawer()}
                    // TODO.
                    // text={sort.label || 'Sort'}
                    text='Filter'
                  />
                </View>
              </View>
              <TextInput
                style={{
                  width: '100%',
                  height: 50,
                  margin: 10,
                  backgroundColor: colors.border,
                  color: colors.text,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onSubmitEditing={() =>
                  setFilters({ ...filters, keyword: inputText })
                }
                value={inputText}
                onChangeText={(value) => setInputText(value)}
                returnKeyType='search'
                // placeholder='useless placeholder'
                // keyboardType="numeric"
              />
            </>
          }
          // ListEmptyComponent={
          //   <View
          //     style={{
          //       flex: 1,
          //       height: 100,
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //     }}
          //   >
          //     <Text style={{ color: colors.text }}>No ads Found.</Text>
          //   </View>
          // }
        />
      )}

      <SortOptionsModal
        isOpen={isOpen}
        toggleFunc={() => setIsOpen(!isOpen)}
        currentSelection={sort}
        handleSelection={handleOptionSelect}
      />
    </View>
  )
}

function DrawerNav() {
  return (
    <Drawer.Navigator
      // TODO.Add custom content here
      drawerContent={(props) => <FilterDrawer {...props} />}
      screenOptions={({ navigation, route }) => ({
        swipeEdgeWidth: 300,
        headerShown: false,
        unmountOnBlur: true,

        drawerPosition: 'right',
      })}
    >
      <Drawer.Screen name={ROUTES.SEARCH} component={Search} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButtonContainer: {
    borderRadius: 20,
    // padding: 2,
    marginHorizontal: 5,
  },
})

export default DrawerNav
