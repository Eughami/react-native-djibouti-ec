import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useState } from 'react';
import { Image, LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { ROUTES } from '@constants/routes';
import IconButton from './IconButton';
import LangModal from './LanguageModal';
import { useStore } from '@zustand/store';

function CustomDrawerContent(props) {
  const { colors: themeColors, dark } = useTheme();
  const theme = useStore((state) => state.theme);
  const swithTheme = useStore((state) => state.swithTheme);
  const [showCar, setShowCar] = useState(false);
  const [showEstate, setShowEstate] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function toggleItem() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCar(!showCar);
  }
  function toggleEstate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowEstate(!showEstate);
  }
  function toggleModal() {
    setShowModal(!showModal);
  }
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <DrawerItem
          label="Latest Ads"
          // onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
        />
        <DrawerItem
          label="Popular Ads"
          // onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
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
              <Text style={[styles.accordTitle, { color }]}>
                DropDown Header
              </Text>
              <Ionicons
                name={showCar ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={toggleItem}
        />
        {showCar && (
          <View>
            <DrawerItem
              label="Category"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
            />
            <DrawerItem
              label="Product"
              onPress={() => props.navigation.navigate(ROUTES.HOME_PRODUCT)}
            />
            <DrawerItem
              label="Categories"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
            />
          </View>
        )}
        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                DropDown Header 2
              </Text>
              <Ionicons
                name={showCar ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={toggleEstate}
        />
        {showEstate && (
          <View>
            <DrawerItem
              label="Category"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
            />
            <DrawerItem
              label="Product"
              onPress={() => props.navigation.navigate(ROUTES.HOME_PRODUCT)}
            />
            <DrawerItem
              label="Categories"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
            />
          </View>
        )}
        <DrawerItem
          label="Popular Ads"
          // onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
        />
        <View style={styles.seperatorContainer}>
          <View
            style={[styles.seperator, { borderColor: themeColors.text }]}
          ></View>
          <Text style={styles.subtitle}>Categories</Text>
        </View>

        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                DropDown Header
              </Text>
              <Ionicons
                name={showCar ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={toggleItem}
        />
        {showCar && (
          <View>
            <DrawerItem
              label="Category"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
            />
            <DrawerItem
              label="Product"
              onPress={() => props.navigation.navigate(ROUTES.HOME_PRODUCT)}
            />
            <DrawerItem
              label="Categories"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
            />
          </View>
        )}
        <DrawerItem
          label={({ color, focused }) => (
            <View style={styles.accordHeader}>
              <Text style={[styles.accordTitle, { color }]}>
                DropDown Header 2
              </Text>
              <Ionicons
                name={showCar ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={color}
              />
            </View>
          )}
          onPress={toggleEstate}
        />
        {showEstate && (
          <View>
            <DrawerItem
              label="Category"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORY)}
            />
            <DrawerItem
              label="Product"
              onPress={() => props.navigation.navigate(ROUTES.HOME_PRODUCT)}
            />
            <DrawerItem
              label="Categories"
              onPress={() => props.navigation.navigate(ROUTES.HOME_CATEGORIES)}
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

            swithTheme(theme === 'light' ? 'dark' : 'light');
          }}
        />
        <Image
          source={require('@assets/flags/fr-flag.png')}
          style={styles.flagStlye}
        />
      </View>
      <LangModal modalVisible={showModal} toggleModal={toggleModal} />
    </View>
  );
}

export default CustomDrawerContent;

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
    fontStyle: 'italic',
    width: '90%',
    marginVertical: 10,
    fontSize: 12,
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
  flagStlye: {
    borderRadius: 50,
  },
});
