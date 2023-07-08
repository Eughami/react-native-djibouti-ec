import IconButton from '@components/IconButton'
import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'
import { useStore } from '@zustand/store'
import { Ionicons } from '@expo/vector-icons'
import Search from '@views/Search'
import NewAd from '@views/NewAd'
import MyAds from '@views/MyAds'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeStack from './HomeStack'
import { handleRoutetitle } from '@constants/common'
import { CommonActions } from '@react-navigation/native'

const BottomTab = createBottomTabNavigator()

function BottomNav() {
  const routeName = useStore((state) => state.routeName)
  const prevRouteName = useStore((state) => state.prevRouteName)
  return (
    <BottomTab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        headerTitle: handleRoutetitle(routeName),
        tabBarActiveTintColor: COLORS.primary.light400,
        tabBarHideOnKeyboard: true,
        tabBarStyle: routeName.includes('.') && { display: 'none' },
        headerLeft: ({ tintColor }) => (
          <IconButton
            icon={
              routeName.includes('.') ? 'arrow-back-outline' : 'menu-outline'
            }
            size={24}
            color={tintColor}
            onPress={() => {
              routeName.includes('.')
                ? navigation.dispatch(
                    CommonActions.navigate({
                      name: prevRouteName,
                      // TODO.future handle usecase where params will be needed
                      params: {},
                    }),
                  )
                : navigation.toggleDrawer()
            }}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === ROUTES.HOME_STACK) {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === ROUTES.NEW_AD) {
            iconName = focused ? 'add-circle-sharp' : 'add-circle-outline'
          } else if (route.name === ROUTES.PROFILE_STACK) {
            iconName = focused ? 'person' : 'person-outline'
          } else if (route.name === ROUTES.SEARCH_STACK) {
            iconName = focused ? 'search' : 'search-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <BottomTab.Screen name={ROUTES.HOME_STACK} component={HomeStack} />
      <BottomTab.Screen name={ROUTES.SEARCH_STACK} component={Search} />
      <BottomTab.Screen name={ROUTES.NEW_AD} component={NewAd} />
      <BottomTab.Screen name={ROUTES.PROFILE_STACK} component={MyAds} />
    </BottomTab.Navigator>
  )
}

export default BottomNav
