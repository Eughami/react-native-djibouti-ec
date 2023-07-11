import FilterDrawer from '@components/FilterDrawer'
import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import SortOptionsModal from '@components/SortOptionModal'
import { sortOptions } from '@constants/common'
import { ROUTES } from '@constants/routes'
import { COLORS, extractRgbComponents } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { searchAds } from '@services/search'
import { useStore } from '@zustand/store'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useQuery } from 'react-query'
import { Ionicons } from '@expo/vector-icons'
import Ad from './Ad'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { trendingAds } from '@services/category'

function Search({ navigation }) {
  const width = Dimensions.get('window').width

  const { colors, dark } = useTheme()
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const [sort, setSort] = useState(sortOptions[0])
  const [isOpen, setIsOpen] = useState(false)
  const [initialRender, setInitialRender] = useState(true)

  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerAnimation = useRef(new Animated.Value(0)).current

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      setTimeout(() => {
        // Close the drawer
        Animated.timing(drawerAnimation, {
          toValue: 0,
          duration: 300, // Adjust the animation duration as needed
          useNativeDriver: true,
        }).start(() => setIsDrawerOpen(false))
      }, 0)
    } else {
      setTimeout(() => {
        // Open the drawer
        setIsDrawerOpen(true)
        Animated.timing(drawerAnimation, {
          toValue: 1,
          duration: 300, // Adjust the animation duration as needed
          useNativeDriver: true,
        }).start()
      }, 0)
    }
  }

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0], // Adjust the desired width of the drawer
  })

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

  const {
    isLoading: topLoading,
    isFetching: topFetching,
    data: topAds,
  } = useQuery('top-ads', trendingAds)

  useEffect(() => {
    if (initialRender) {
      // setInitialRender(false)
      return
    }

    setList([])
    if (page !== 1) {
      setPage(1)
    } else {
      refetch()
    }
  }, [sort, filters])

  useEffect(() => {
    if (initialRender) return

    refetch()
  }, [page])

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setSort(option)
    setInitialRender(false)
    setIsOpen(false)
  }

  const handleEndReached = () => {
    if (hasMore) {
      setPage(page + 1)
    }
  }

  const loading = isLoading || isFetching || topFetching || topLoading
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
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
            // onPress={() => navigation.toggleDrawer()}
            onPress={() => toggleDrawer()}
            text='Filter'
          />
        </View>
      </View>
      <TextInput
        style={{
          height: 50,
          marginVertical: 10,
          marginHorizontal: 5,
          backgroundColor: colors.border,
          color: colors.text,
          borderColor: colors.border,
          borderWidth: 1,
        }}
        onSubmitEditing={() => {
          setInitialRender(false)
          setFilters({ ...filters, keyword: inputText })
        }}
        value={inputText}
        onChangeText={(value) => setInputText(value)}
        returnKeyType='search'
        placeholder=' Search for ads'
        placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
      />
      {page === 1 && loading ? (
        <Loader />
      ) : topAds?.data?.length && initialRender ? (
        <FlatList
          key='top'
          ListHeaderComponent={
            <Text
              style={{ flex: 1, padding: 10, fontWeight: 'bold', fontSize: 14 }}
            >
              Top Ads
            </Text>
          }
          style={{ flex: 1, padding: 10 }}
          data={topAds.data.sort((a, b) => b.count - a.count)}
          renderItem={(itemData) => <Preview {...itemData.item} small />}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      ) : (
        <FlatList
          key='searchResult'
          style={{ flex: 1, width: '100%' }}
          data={list}
          renderItem={(itemData) => <Preview {...itemData.item} />}
          keyExtractor={(item) => item.id}
          ListFooterComponent={hasMore || loading ? Loader : null}
          onEndReached={handleEndReached}
          stickyHeaderHiddenOnScroll
          onEndReachedThreshold={0.5}
          numColumns={width > 500 ? 2 : 1}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.text }}>No ads Found.</Text>
            </View>
          }
        />
      )}

      <SortOptionsModal
        isOpen={isOpen}
        toggleFunc={() => setIsOpen(!isOpen)}
        currentSelection={sort}
        handleSelection={handleOptionSelect}
      />
      {isDrawerOpen && (
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
            },
            { transform: [{ translateX: drawerTranslateX }] },
          ]}
        >
          <FilterDrawer
            toggle={toggleDrawer}
            isDrawerOpen={isDrawerOpen}
            translateX={drawerTranslateX}
            setInitialRender={setInitialRender}
          />
        </Animated.View>
      )}
    </View>
  )
}

const Stack = createNativeStackNavigator()

function SearchStack() {
  const routeName = useStore((state) => state.routeName)
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        headerLeft: ({ tintColor }) => (
          <Ionicons
            style={{ marginRight: 30 }}
            name={
              routeName.includes('.') ? 'arrow-back-outline' : 'menu-outline'
            }
            size={24}
            color={tintColor}
            onPress={() => {
              routeName.includes('.')
                ? navigation.goBack()
                : navigation.getParent().openDrawer()
            }}
          />
        ),
      })}
    >
      <Stack.Screen name={ROUTES.SEARCH} component={Search} />
      <Stack.Screen name={ROUTES.HOME_AD} component={Ad} />
    </Stack.Navigator>
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

export default SearchStack
