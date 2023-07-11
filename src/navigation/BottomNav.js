import IconButton from '@components/IconButton'
import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'
import { useStore } from '@zustand/store'
import { Ionicons } from '@expo/vector-icons'
import SearchStack from '@views/Search'
import NewAdStack from '@views/NewAd'
import MyAdsStack from '@views/MyAds'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeStack from './HomeStack'

const BottomTab = createBottomTabNavigator()

function BottomNav() {
  const routeName = useStore((state) => state.routeName)
  const theme = useStore((state) => state.theme)
  return (
    <BottomTab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS[theme].dominant,
        tabBarHideOnKeyboard: true,
        tabBarStyle: routeName.includes('.') && { display: 'none' },
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
      <BottomTab.Screen name={ROUTES.SEARCH_STACK} component={SearchStack} />
      <BottomTab.Screen name={ROUTES.NEW_AD} component={NewAdStack} />
      <BottomTab.Screen name={ROUTES.PROFILE_STACK} component={MyAdsStack} />
    </BottomTab.Navigator>
  )
}

export default BottomNav
