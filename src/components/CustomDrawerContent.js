import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useState } from 'react'
import { Image, LayoutAnimation, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import { ROUTES } from '@constants/routes'
import IconButton from './IconButton'
import LangModal from './LanguageModal'
import { useStore } from '@zustand/store'
import { CategoryEnum } from '@constants/categories'
import AsyncStorage from '@react-native-async-storage/async-storage'

function CustomDrawerContent(props) {
  const { colors: themeColors, dark } = useTheme()
  const theme = useStore((state) => state.theme)
  const swithTheme = useStore((state) => state.swithTheme)
  const [showVehicles, setShowVehicles] = useState(false)
  const [showEstate, setShowEstate] = useState(false)
  const [showJobs, setShowJobs] = useState(false)
  const [showHomeItems, setShowHomeItems] = useState(false)
  const [showElectrocnis, setShowElectrocnis] = useState(false)
  const [showLeisure, setShowLeisure] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function toggleItem(func, bool) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    func(!bool)
  }
  function toggleModal() {
    setShowModal(!showModal)
  }
  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <DrawerItem
          label='Latest Ads'
          onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
        />
        <DrawerItem
          label='Popular Ads'
          // TODO.make an endpoint that gives top 20||50 ads for last week||month
          onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
        />
        <View style={styles.seperatorContainer}>
          <View
            style={[styles.seperator, { borderColor: themeColors.text }]}
          ></View>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            Categories
          </Text>
        </View>

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>Vehicles</Text>
              <Ionicons
                name={showVehicles ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowVehicles, showVehicles)}
        />
        {showVehicles && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.PartAndAccessory}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.PartAndAccessory}`,
                  { category: CategoryEnum.PartAndAccessory },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Boat}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Boat}`,
                  { category: CategoryEnum.Boat },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Motorcycle}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Motorcycle}`,
                  { category: CategoryEnum.Motorcycle },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Car}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Car}`,
                  { category: CategoryEnum.Car },
                )
              }
            />
          </View>
        )}
        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>Real Estate</Text>
              <Ionicons
                name={showEstate ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowEstate, showEstate)}
        />
        {showEstate && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.CommercialProperty}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.CommercialProperty}`,
                  { category: CategoryEnum.CommercialProperty },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Land}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Land}`,
                  { category: CategoryEnum.Land },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.HouseRent}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HouseRent}`,
                  { category: CategoryEnum.HouseRent },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.HouseSale}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HouseSale}`,
                  { category: CategoryEnum.HouseSale },
                )
              }
            />
          </View>
        )}

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                Jobs & Services
              </Text>
              <Ionicons
                name={showJobs ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowJobs, showJobs)}
        />
        {showJobs && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.MachineAndEquipment}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.MachineAndEquipment}`,
                  { category: CategoryEnum.MachineAndEquipment },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Service}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Service}`,
                  { category: CategoryEnum.Service },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Job}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Job}`,
                  { category: CategoryEnum.Job },
                )
              }
            />
          </View>
        )}

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                Home Appliance
              </Text>
              <Ionicons
                name={showHomeItems ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowHomeItems, showHomeItems)}
        />
        {showHomeItems && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.Accessory}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Accessory}`,
                  { category: CategoryEnum.Accessory },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Clothe}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Clothe}`,
                  { category: CategoryEnum.Clothe },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.AirConditioner}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.AirConditioner}`,
                  { category: CategoryEnum.AirConditioner },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.HomeAppliance}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HomeAppliance}`,
                  { category: CategoryEnum.HomeAppliance },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.HomeDecor}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HomeDecor}`,
                  { category: CategoryEnum.HomeDecor },
                )
              }
            />
          </View>
        )}

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>Electronics</Text>
              <Ionicons
                name={showElectrocnis ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowElectrocnis, showElectrocnis)}
        />
        {showElectrocnis && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.TV}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.TV}`,
                  { category: CategoryEnum.TV },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Mobile}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Mobile}`,
                  { category: CategoryEnum.Mobile },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Game}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Game}`,
                  { category: CategoryEnum.Game },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Computer}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Computer}`,
                  { category: CategoryEnum.Computer },
                )
              }
            />
          </View>
        )}

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                Leisure, Sports & Hobby
              </Text>
              <Ionicons
                name={showLeisure ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={() => toggleItem(setShowLeisure, showLeisure)}
        />
        {showLeisure && (
          <View
            style={[
              styles.collapsed,
              {
                backgroundColor: dark ? '#232323' : '#f0f0f0',
              },
            ]}
          >
            <DrawerItem
              label={CategoryEnum.Movie}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Movie}`,
                  { category: CategoryEnum.Movie },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Toy}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Toy}`,
                  { category: CategoryEnum.Toy },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Book}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Book}`,
                  { category: CategoryEnum.Book },
                )
              }
            />
            <DrawerItem
              label={CategoryEnum.Sport}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Sport}`,
                  { category: CategoryEnum.Sport },
                )
              }
            />
          </View>
        )}
      </DrawerContentScrollView>
      <View
        style={[
          styles.bottomContainer,
          {
            backgroundColor: themeColors.card,
            borderTopColor: themeColors.border,
            borderTopWidth: 1,
          },
        ]}
      >
        <IconButton
          color={themeColors.text}
          size={30}
          icon={dark ? 'moon-outline' : 'sunny-outline'}
          onPress={() => {
            // TODO.maybe handle it in a modal in the future for more options
            // props.navigation.toggleDrawer()
            // toggleModal()
            const newTheme = theme === 'light' ? 'dark' : 'light'
            AsyncStorage.setItem('theme', newTheme)
            swithTheme(newTheme)
          }}
        />
        <Image
          source={require('@assets/flags/fr-flag.png')}
          style={styles.flagStlye}
        />
      </View>
      <LangModal modalVisible={showModal} toggleModal={toggleModal} />
    </View>
  )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    paddingBottom: 4,
  },
  accordHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accordTitle: {
    fontWeight: '500',
  },
  seperatorContainer: {
    alignItems: 'center',
  },
  seperator: {
    marginVertical: 10,
    borderTopWidth: 0.5,
    width: '75%',
  },
  // TODO. do we actually need this ?
  subtitle: {
    width: '90%',
    marginVertical: 10,
    fontSize: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    // opacity: 0.8,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsed: {
    paddingLeft: 20,
    // margin: 5,
    // width: '80%',
    backgroundColor: '#232323',
    backgroundColor: '#f0f0f0',
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  flagStlye: {
    borderRadius: 50,
  },
})
