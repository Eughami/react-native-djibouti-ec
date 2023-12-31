import IconButton from '@components/IconButton'
import { CategoryEnum } from '@constants/categories'
import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Ad from '@views/Ad'
import Categories from '@views/Categories'
import Category from '@views/Category'
import Home from '@views/Home'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '@zustand/store'
import { handleRoutetitle } from '@constants/common'
import translate from '@lang/translate'

const Stack = createNativeStackNavigator()

function HomeStack() {
  const routeName = useStore((state) => state.routeName)
  const theme = useStore((state) => state.theme)
  const lang = useStore((state) => state.lang)

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        animation: 'slide_from_right',
        title: translate(handleRoutetitle(routeName), lang),
        headerStyle: { backgroundColor: COLORS[theme].dominant },
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
                : navigation.toggleDrawer()
            }}
          />
        ),
      })}
    >
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen name={ROUTES.HOME_AD} component={Ad} />
      <Stack.Screen name={ROUTES.HOME_CATEGORY} component={Category} />
      <Stack.Screen name={ROUTES.HOME_TRENDING} component={Category} />
      <Stack.Screen name={ROUTES.HOME_LATEST} component={Category} />
      {Object.keys(CategoryEnum).map((cat, i) => (
        <Stack.Screen
          name={`${ROUTES.HOME_CATEGORY}.${cat}`}
          component={Category}
          key={i}
        />
      ))}
    </Stack.Navigator>
  )
}

export default HomeStack
