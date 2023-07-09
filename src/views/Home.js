import { useTheme } from '@react-navigation/native'
import {
  AppState,
  Button,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native'
import Preview from '@components/Preview'
import Avatar from '@components/Avatar'
import { HomeCategories } from '@constants/categories'
import { useQuery } from 'react-query'
import { getFav, homePageAds } from '@services/home'
import Loader from '@components/Loader'
import { COLORS } from '@constants/style'
import { useRefreshOnFocus } from '@components/FocusRefetch'
import { useEffect } from 'react'
import { useStore } from '@zustand/store'

function Title({ text }) {
  const { colors } = useTheme()
  return (
    <View style={{ margin: 20 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          paddingLeft: 10,
          fontWeight: 'bold',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

function TopCategories() {
  // TODO. remove this flatlist and make it  a fixed 6  items
  return (
    <View
      style={{
        // backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {HomeCategories.map((item) => (
        <Avatar icon={item.icon} title={item.name} key={item.name} />
      ))}
    </View>
  )
}

function HomePage() {
  const { colors } = useTheme()
  const setFavCat = useStore((state) => state.setFavCat)

  const {
    isLoading,
    isFetching,
    data: ads,
    refetch,
  } = useQuery('home-page-ads', () => homePageAds(), {})

  const {} = useQuery('fav-cat', () => getFav(), {
    onSuccess: (data) => setFavCat(data?.favoriteCategories ?? []),
  })

  // TODO.Screen focus refetch worth it ??
  // useRefreshOnFocus(refetch)

  const onAppStateChange = (status) => {
    if (Platform.OS !== 'web' && status === 'active') {
      refetch()
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    return () => subscription.remove()
  }, [])

  const loading = isFetching || isLoading
  return (
    <ScrollView style={{ backgroundColor: colors.card }}>
      <Title text='Categories' />
      <TopCategories />
      <Title text='Latest Ads' />
      <HomeAds loading={loading} refetch={refetch} ads={ads} />
    </ScrollView>
  )
}

function HomeAds({ loading, ads, refetch }) {
  const { colors } = useTheme()
  if (loading)
    return (
      <View style={{ minHeight: 200 }}>
        <Loader />
      </View>
    )
  return (
    <>
      {!ads || ads.data.length === 0 ? (
        <View
          style={{
            flex: 1,
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.text, marginBottom: 10 }}>
            Could not fetch any ads ...
          </Text>
          <Button
            title='refetch'
            color={COLORS.primary.color}
            onPress={refetch}
          />
        </View>
      ) : (
        <>
          {ads.data.map((item) => (
            <Preview {...item} key={item.id} />
          ))}
        </>
      )}
    </>
  )
}

export default HomePage
