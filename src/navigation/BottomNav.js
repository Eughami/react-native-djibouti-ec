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

const BottomTab = createBottomTabNavigator()

function BottomNav() {
  const routeName = useStore((state) => state.routeName)
  return (
    <BottomTab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        headerTitle: handleRoutetitle(routeName),
        tabBarActiveTintColor: COLORS.primary.light400,
        headerLeft: ({ tintColor }) => (
          <IconButton
            icon={
              routeName.includes('.') ? 'arrow-back-outline' : 'menu-outline'
            }
            size={24}
            color={tintColor}
            onPress={() => {
              routeName.includes('.')
                ? navigation.goBack()
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
          } else if (route.name === ROUTES.MY_ADS) {
            iconName = focused ? 'person' : 'person-outline'
          } else if (route.name === ROUTES.SEARCH) {
            iconName = focused ? 'search' : 'search-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <BottomTab.Screen name={ROUTES.HOME_STACK} component={HomeStack} />
      <BottomTab.Screen name={ROUTES.SEARCH} component={Search} />
      <BottomTab.Screen name={ROUTES.NEW_AD} component={NewAd} />
      <BottomTab.Screen name={ROUTES.MY_ADS} component={MyAds} />
    </BottomTab.Navigator>
  )
}

export default BottomNav
