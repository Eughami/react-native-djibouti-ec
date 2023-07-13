import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useState } from 'react'
import { Image, LayoutAnimation, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import { ROUTES } from '@constants/routes'
import IconButton from './IconButton'
import LangModal from './LanguageModal'
import { useStore } from '@zustand/store'
import { CategoryEnum } from '@constants/categories'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLighterShade } from '@constants/style'
import translate from '@lang/translate'

function CustomDrawerContent(props) {
  const { colors: themeColors, dark } = useTheme()
  const lang = useStore((state) => state.lang)
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
          label={translate('routes.Home.LatestAd', lang)}
          onPress={() => props.navigation.navigate(ROUTES.HOME_LATEST)}
        />
        <DrawerItem
          label={translate('routes.Home.Trending', lang)}
          // TODO.make an endpoint that gives top 20||50 ads for last week||month
          onPress={() =>
            props.navigation.navigate(ROUTES.HOME_TRENDING, {
              category: 'trending',
            })
          }
        />
        <View style={styles.seperatorContainer}>
          <View
            style={[styles.seperator, { borderColor: themeColors.text }]}
          ></View>
          {/* <Text style={[styles.subtitle, { color: themeColors.text }]}>
            Categories
          </Text> */}
        </View>

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                {translate('menu.Vehicles', lang)}
              </Text>
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(
                `categories.${CategoryEnum.PartAndAccessory}`,
                lang,
              )}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.PartAndAccessory}`,
                  { category: CategoryEnum.PartAndAccessory },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Boat}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Boat}`,
                  { category: CategoryEnum.Boat },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Motorcycle}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Motorcycle}`,
                  { category: CategoryEnum.Motorcycle },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Car}`, lang)}
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
              <Text style={[styles.accordTitle, { color }]}>
                {translate('menu.RealEstate', lang)}
              </Text>
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(
                `categories.${CategoryEnum.CommercialProperty}`,
                lang,
              )}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.CommercialProperty}`,
                  { category: CategoryEnum.CommercialProperty },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Land}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Land}`,
                  { category: CategoryEnum.Land },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.HouseRent}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HouseRent}`,
                  { category: CategoryEnum.HouseRent },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.HouseSale}`, lang)}
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
                {translate('menu.jobs', lang)}
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(
                `categories.${CategoryEnum.MachineAndEquipment}`,
                lang,
              )}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.MachineAndEquipment}`,
                  { category: CategoryEnum.MachineAndEquipment },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Service}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Service}`,
                  { category: CategoryEnum.Service },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Job}`, lang)}
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
                {translate('menu.homeAppliance', lang)}
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Accessory}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Accessory}`,
                  { category: CategoryEnum.Accessory },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Clothe}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Clothe}`,
                  { category: CategoryEnum.Clothe },
                )
              }
            />
            <DrawerItem
              label={translate(
                `categories.${CategoryEnum.AirConditioner}`,
                lang,
              )}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.AirConditioner}`,
                  { category: CategoryEnum.AirConditioner },
                )
              }
            />
            <DrawerItem
              label={translate(
                `categories.${CategoryEnum.HomeAppliance}`,
                lang,
              )}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.HomeAppliance}`,
                  { category: CategoryEnum.HomeAppliance },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.HomeDecor}`, lang)}
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
              <Text style={[styles.accordTitle, { color }]}>
                {translate('menu.Electronics', lang)}
              </Text>
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(`categories.${CategoryEnum.TV}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.TV}`,
                  { category: CategoryEnum.TV },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Mobile}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Mobile}`,
                  { category: CategoryEnum.Mobile },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Game}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Game}`,
                  { category: CategoryEnum.Game },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Computer}`, lang)}
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
                {translate('menu.leisure', lang)}
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
                backgroundColor: getLighterShade(themeColors.border, 0.3),
              },
            ]}
          >
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Movie}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Movie}`,
                  { category: CategoryEnum.Movie },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Toy}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Toy}`,
                  { category: CategoryEnum.Toy },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Book}`, lang)}
              onPress={() =>
                props.navigation.navigate(
                  `${ROUTES.HOME_CATEGORY}.${CategoryEnum.Book}`,
                  { category: CategoryEnum.Book },
                )
              }
            />
            <DrawerItem
              label={translate(`categories.${CategoryEnum.Sport}`, lang)}
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
          source={
            lang === 'en'
              ? require('@assets/flags/en-flag.png')
              : require('@assets/flags/fr-flag.png')
          }
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
    marginVertical: 20,
    borderTopWidth: 0.5,
    width: '75%',
  },
  // TODO. do we actually need this ?
  subtitle: {
    width: '90%',
    marginTop: 10,
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
