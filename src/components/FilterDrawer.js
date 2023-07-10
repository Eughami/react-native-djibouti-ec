import { useTheme } from '@react-navigation/native'
import {
  BackHandler,
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import FormLabel from './FormLabel'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useState } from 'react'
import { CategoryEnum } from '@constants/categories'
import IconButton from './IconButton'
import { DateOptions } from '@constants/common'
import CustomButton from './CustomButton'
import { useStore } from '@zustand/store'

function FilterDrawer(props) {
  const height = Dimensions.get('window').height
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const { colors, dark } = useTheme()
  const [min, setMin] = useState(filters.min)
  const [max, setMax] = useState(filters.max)
  const [adType, setAdType] = useState(filters.adType)
  const [categories, setCategories] = useState(filters.categories)
  const [date, setDate] = useState(filters.date)

  useEffect(() => {
    const handleBackPress = () => {
      if (props.isDrawerOpen) {
        props.toggle()
        return true // Prevent default back button behavior
      }
      return false // Allow default back button behavior
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => {
      console.log('Removed from the screen')
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
  }, [props.isDrawerOpen])

  function toggleType(bool) {
    setAdType(bool)
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={props.toggle}
        style={{
          flex: 3,
          width: '30%',
          backgroundColor: colors.card,
          opacity: 0.7,
        }}
      />
      <View
        style={{
          flex: 7,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: colors.border,
        }}
      >
        <ScrollView style={{ flex: 1, marginBottom: 45 }}>
          <FormLabel label='Categories' marginLeft={20} />
          <DropDownPicker
            listMode='SCROLLVIEW'
            open={true}
            multiple={true}
            value={categories}
            items={Object.keys(CategoryEnum).map((cat, i) => ({
              label: cat,
              value: cat,
            }))}
            setValue={setCategories}
            theme={dark ? 'DARK' : 'LIGHT'}
            mode='BADGE'
            placeholder='Select a category'
            closeOnBackPressed
            style={{
              marginBottom: 10,
              // borderWidth: 1,
              backgroundColor: dark ? '#2b2e3dff' : colors.background,
              borderColor: colors.border,
              borderWidth: 0,
            }}
            selectedItemContainerStyle={{
              backgroundColor: dark ? '#1c1e29ff' : colors.border,
            }}
            listParentLabelStyle={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            containerStyle={{
              height: height * 0.4,
            }}
            showArrowIcon={false}
            dropDownContainerStyle={{
              maxHeight: height * 0.4 + 50,
              height: height * 0.4 - 50,
              borderColor: colors.border,
              backgroundColor: dark ? '#2b2e3dff' : colors.background,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderWidth: 1,
            }}
          />
          <FormLabel label='Date' marginLeft={20} />
          <View style={styles.dateContainer}>
            {DateOptions.map((dt, i) => (
              <CustomButton
                text={dt}
                isSelected={date === dt}
                key={i}
                onPress={() => setDate(dt)}
              />
            ))}
          </View>

          <FormLabel label='Price' marginLeft={20} />
          <View style={styles.priceContainer}>
            <TextInput
              keyboardType='numeric'
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
                },
              ]}
              placeholder='Min'
              placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
              onBlur={() =>
                min && setMin(parseInt(min).toLocaleString('en-US'))
              }
              onChangeText={(value) => setMin(value)}
              value={min}
              onFocus={() => min && setMin(min.replace(/[^0-9]/g, ''))}
            />
            <Text style={{ color: colors.text }}> -- </Text>

            <TextInput
              keyboardType='numeric'
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
                },
              ]}
              placeholder='Max'
              placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
              onBlur={() =>
                max && setMax(parseInt(max).toLocaleString('en-US'))
              }
              onChangeText={(value) => setMax(value)}
              value={max}
              onFocus={() => max && setMax(max.replace(/[^0-9]/g, ''))}
            />
          </View>

          <FormLabel label='Ad Type' marginLeft={20} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <IconButton
                color={colors.text}
                size={20}
                icon={`radio-button-o${adType ? 'n' : 'ff'}-outline`}
                onPress={() => toggleType(true)}
              />
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                For Sale
              </Text>
            </View>
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <IconButton
                color={colors.text}
                size={20}
                icon={`radio-button-o${!adType ? 'n' : 'ff'}-outline`}
                onPress={() => toggleType(false)}
              />
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                Wanted
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <CustomButton width='50%' text='Cancel' onPress={props.toggle} />
          <CustomButton
            width='50%'
            isSelected
            text='Apply'
            onPress={() => {
              setFilters({ ...filters, categories, date, min, max, adType })
              props.toggle()
              props.setInitialRender(false)
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  input: {
    height: 50,
    width: '45%',
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
  },
})

export default FilterDrawer
