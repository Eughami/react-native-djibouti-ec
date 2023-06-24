import CustomDrawerContent from '@components/CustomDrawerContent'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomNav from './BottomNav'
import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'

const Drawer = createDrawerNavigator()

function DrawerNav() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        drawerActiveTintColor: COLORS.primary.dark600,
        drawerActiveBackgroundColor: COLORS.primary.light300,
        headerShown: false,
        swipeEnabled: false,
      })}
    >
      <Drawer.Screen name={ROUTES.BOTTOM_TAB_ROUTES} component={BottomNav} />
    </Drawer.Navigator>
  )
}

export default DrawerNav
