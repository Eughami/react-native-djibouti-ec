import 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '@views/Home';
import MyAds from '@views/MyAds';
import NewAd from '@views/NewAd';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Search from '@views/Search';
import Category from '@views/Category';
import { Appearance, SafeAreaView, useWindowDimensions } from 'react-native';
import { COLORS } from '@constants/style';
import IconButton from '@components/IconButton';
import Ad from '@views/Ad';
import Categories from '@views/Categories';
// import { useEffect } from 'react'
// import { useStore } from '@zustand/store'

const BottomNav = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        style={props.styles}
        label="Categories"
        onPress={() => props.navigation.navigate('Home.Categories')}
      />
      <DrawerItem
        label="Category"
        onPress={() => props.navigation.navigate('Home.Category')}
      />
      <DrawerItem
        label="Product"
        onPress={() => props.navigation.navigate('Home.Product')}
      />
    </DrawerContentScrollView>
  );
}
function DrawerTabs() {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        drawerContentStyle: { backgroundColor: COLORS.primary.dark200 },
        drawerInactiveTintColor: 'white',
        drawerActiveTintColor: COLORS.primary.dark600,
        drawerActiveBackgroundColor: COLORS.primary.light300,
        headerShown: false,
        swipeEnabled: false,
      })}
    >
      <Drawer.Screen name="Home-Tab" component={BottomTabs} />
    </Drawer.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        drawerContentStyle: { backgroundColor: COLORS.primary.dark200 },
        drawerInactiveTintColor: 'white',
        drawerActiveTintColor: COLORS.primary.dark600,
        drawerActiveBackgroundColor: COLORS.primary.light300,
        headerLeft: ({ tintColor }) => (
          <IconButton
            icon={
              route.name === 'Homepage' ? 'menu-outline' : 'arrow-back-outline'
            }
            size={24}
            color={tintColor}
            onPress={() => {
              route.name === 'Homepage'
                ? navigation.toggleDrawer()
                : navigation.goBack();
            }}
          />
        ),
      })}
    >
      <Stack.Screen name="Homepage" component={Home} />
      <Stack.Screen name="Home.Product" component={Ad} />
      <Stack.Screen name="Home.Category" component={Category} />
      <Stack.Screen name="Home.Categories" component={Categories} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <BottomNav.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: COLORS.primary.color },
        headerTintColor: 'white',
        drawerContentStyle: { backgroundColor: COLORS.primary.dark200 },
        drawerInactiveTintColor: 'white',
        drawerActiveTintColor: COLORS.primary.dark600,
        drawerActiveBackgroundColor: COLORS.primary.light300,
        headerBackVisible: true,
        headerShown: !route.name.toLowerCase().includes('home'),
        headerLeft: ({ tintColor }) => (
          <IconButton
            icon="menu-outline"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'NewAd') {
            iconName = focused ? 'add-circle-sharp' : 'add-circle-outline';
          } else if (route.name === 'MyAds') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomNav.Screen name="Home" component={HomeStack} />
      <BottomNav.Screen name="Search" component={Search} />
      <BottomNav.Screen name="NewAd" component={NewAd} />
      <BottomNav.Screen name="MyAds" component={MyAds} />
    </BottomNav.Navigator>
  );
}

export default function App() {
  const theme = Appearance.getColorScheme();
  // const swithTheme = useStore((state) => state.swithTheme)

  // console.log(theme)

  // useEffect(() => {
  //   // check locaStorage for a value
  //   // use that value
  //   // if !value then it is the firstTime so get the devicePreference
  //   swithTheme(Appearance.getColorScheme())

  //   // TODO. when a user explicitly changes the theme
  //   // save in localStorage and update the zustandStore
  // }, [])
  // TODO.find a way to avoid the shift of the drawer toggle in homepage
  return (
    <>
      <StatusBar style="auto" translucent={true} />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <DrawerTabs />
      </NavigationContainer>
    </>
  );
}
