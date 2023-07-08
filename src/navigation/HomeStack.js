import { CategoryEnum } from '@constants/categories'
import { ROUTES } from '@constants/routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Ad from '@views/Ad'
import Categories from '@views/Categories'
import Category from '@views/Category'
import Home from '@views/Home'

const Stack = createNativeStackNavigator()

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen name={ROUTES.HOME_AD} component={Ad} />
      <Stack.Screen name={ROUTES.HOME_CATEGORY} component={Category} />
      <Stack.Screen name={ROUTES.HOME_CATEGORIES} component={Categories} />
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
