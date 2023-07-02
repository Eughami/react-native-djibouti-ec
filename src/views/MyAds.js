import IconButton from '@components/IconButton'
import SelectedOption from '@components/SelectedOption'
import { sortOptions } from '@constants/common'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Button,
  Modal,
  Pressable,
} from 'react-native'

const Drawer = createDrawerNavigator()
const Dropdown = ({ navigation }) => {
  const { colors, dark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')

  const options = ['Option 1', 'Option 2', 'Option 3']

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <IconButton
          icon='swap-vertical-outline'
          color={colors.text}
          size={30}
          onPress={handleToggleDropdown}
          text='Sort'
        />
      </View>
      <Button title='drawer' onPress={() => navigation.toggleDrawer()} />

      <Modal
        visible={isOpen}
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            flex: 1,
            backgroundColor: dark ? 'rgba(1, 1, 1, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: dark ? colors.border : colors.card,
              padding: 16,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                marginVertical: 10,
              }}
            >
              Select which Ads you would like to see first
            </Text>
            {sortOptions.map((option) => (
              <SelectedOption
                text={option.label}
                key={option.value}
                toggleFunc={() => handleOptionSelect(option.value)}
                isSelected={selectedOption === option.value}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

function DrawerNav() {
  return (
    <Drawer.Navigator
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        // drawerActiveTintColor: COLORS.primary.dark600,
        // drawerActiveBackgroundColor: COLORS.primary.light300,
        headerShown: false,
        drawerPosition: 'right',
        // swipeEnabled: false,
      })}
    >
      <Drawer.Screen name='Search-shit' component={Dropdown} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    // flexDirection: 'row',
  },
  triggerContainer: {
    // flex: 1,
  },
  trigger: {
    padding: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    zIndex: 1,
  },
  cone: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ccc',
  },
  option: {
    paddingVertical: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
  },
})

export default DrawerNav
