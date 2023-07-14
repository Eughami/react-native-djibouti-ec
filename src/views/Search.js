import FilterDrawer from '@components/FilterDrawer'
import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import SortOptionsModal from '@components/SortOptionModal'
import { handleRoutetitle, sortOptions } from '@constants/common'
import { ROUTES } from '@constants/routes'
import { COLORS, getLighterShade } from '@constants/style'
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
import translate from '@lang/translate'

function Search({ navigation }) {
  const width = Dimensions.get('window').width

  const { colors, dark } = useTheme()
  const lang = useStore((state) => state.lang)
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
      // Close the drawer
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300, // Adjust the animation duration as needed
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false))
    } else {
      // Open the drawer
      setIsDrawerOpen(true)
      Animated.timing(drawerAnimation, {
        toValue: 1,
        duration: 300, // Adjust the animation duration as needed
        useNativeDriver: true,
      }).start()
    }
  }

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0], // Adjust the desired width of the drawer
  })

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
    setIsOpen(false)
    if (option === sort) return
    setSort(option)
    setInitialRender(false)
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
              backgroundColor: dark ? colors.border : colors.background,
            },
          ]}
        >
          <IconButton
            icon='swap-vertical-outline'
            color={colors.text}
            size={20}
            onPress={handleToggleDropdown}
            text={translate(`sort.${sort.label}`, lang)}
          />
        </View>
        <View
          style={[
            styles.iconButtonContainer,
            {
              backgroundColor: dark ? colors.border : colors.background,
            },
          ]}
        >
          <IconButton
            icon='funnel-outline'
            color={colors.text}
            size={20}
            // onPress={() => navigation.toggleDrawer()}
            onPress={() => toggleDrawer()}
            text={translate(`filter`, lang)}
          />
        </View>
      </View>
      <TextInput
        style={{
          height: 50,
          marginVertical: 10,
          marginHorizontal: 5,
          backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
          color: colors.text,
          borderRadius: 5,
        }}
        onSubmitEditing={() => {
          setInitialRender(false)
          setFilters({ ...filters, keyword: inputText })
        }}
        value={inputText}
        onChangeText={(value) => setInputText(value)}
        returnKeyType='search'
        placeholder={translate(`search.placeholder`, lang)}
        // placeholderTextColor={COLORS[dark ? 'dark' : 'light'].placeholder}
        placeholderTextColor={getLighterShade(colors.text, 0.4)}
      />
      {page === 1 && loading ? (
        <Loader />
      ) : topAds?.data?.length && initialRender ? (
        <FlatList
          key='top'
          ListHeaderComponent={
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                fontSize: 14,
                color: colors.text,
              }}
            >
              {translate('popular.ads', lang)}
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
              <Text style={{ color: colors.text }}>
                {translate('no.ads', lang)}
              </Text>
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
  const lang = useStore((state) => state.lang)
  const { dark } = useTheme()
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        animation: 'slide_from_right',
        title: translate(handleRoutetitle(routeName), lang),
        headerStyle: {
          backgroundColor: COLORS[dark ? 'dark' : 'light'].dominant,
        },
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
