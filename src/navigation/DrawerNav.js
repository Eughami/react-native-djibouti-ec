import CustomDrawerContent from '@components/CustomDrawerContent'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomNav from './BottomNav'
import { ROUTES } from '@constants/routes'

const Drawer = createDrawerNavigator()

function DrawerNav() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
        swipeEnabled: false,
      })}
    >
      <Drawer.Screen name={ROUTES.BOTTOM_TAB_ROUTES} component={BottomNav} />
    </Drawer.Navigator>
  )
}

export default DrawerNav
