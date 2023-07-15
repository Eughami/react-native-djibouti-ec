import { useNavigation, useTheme } from '@react-navigation/native'
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useRef, useState } from 'react'
import IconButton from '@components/IconButton'
import { COLORS, getLighterShade } from '@constants/style'
import * as ImagePicker from 'expo-image-picker'
import FormLabel from '@components/FormLabel'
import { Video, ResizeMode } from 'expo-av'
import { CategoryEnum } from '@constants/categories'
import Progressoverlay from '@components/ProgressOverlay'
import axiosInstance from '@constants/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ROUTES } from '@constants/routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useStore } from '@zustand/store'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from 'react-query'
import CustomButton from '@components/CustomButton'
import translate from '@lang/translate'
import { handleRoutetitle } from '@constants/common'

function NewAd() {
  const { navigate } = useNavigation()
  const lang = useStore((state) => state.lang)
  const queryClient = useQueryClient()
  const { colors, dark } = useTheme()
  const video = useRef(null)
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [adType, setAdType] = useState(true)
  const [videoUri, setVideo] = useState(null)
  const [status, setStatus] = useState({})
  const [progress, setProgress] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (images.length === 0) setVideo(null)
  }, [images])

  const {
    // register,
    // setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // firstName: '',
      // lastName: '',
    },
  })

  const onSubmit = async (data) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('isService', adType)
    if (data.price) formData.append('price', data.price.replace(/[^0-9]/g, ''))
    formData.append('category', data.category)
    if (data.phone) formData.append('phone', data.phone.replace(/[^0-9]/g, ''))

    for (const image of images) {
      formData.append('files', {
        uri: image.uri,
        type: `image/${image.uri.split('.')[1]}`,
        name: image.uri.split('/').pop(),
      })
    }
    if (videoUri) {
      formData.append('files', {
        uri: videoUri,
        type: `video/${videoUri.split('.')[1]}}`,
        name: videoUri.split('/').pop(),
      })
    }

    setModalVisible(true)
    let deviceId = await AsyncStorage.getItem('deviceId')
    formData.append('deviceId', deviceId)
    axiosInstance({
      url: '/ads',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        const axiosProgress = loaded / total
        setProgress(axiosProgress)
      },
    })
      .then(function (response) {
        console.log('response :', response)
        queryClient.invalidateQueries('my-ads')
        queryClient.invalidateQueries('home-page-ads')
        navigate(ROUTES.HOME)

        setModalVisible(false)
        resetAll()
        // TODO.on success redirect to home and invalidate the homequery
        // Alert.alert('Your Ad is live!')
      })
      .catch(function (error) {
        setModalVisible(false)
        // TODO.make it modular in the future
        let msg = translate('error.wrong', lang)
        let sub = translate('error.check', lang)
        switch (error?.statusCode) {
          case 413:
            msg = translate('error.filelarge', lang)
            sub = translate('error.sizelimit', lang)
            break

          default:
            break
        }
        Alert.alert(msg, sub)
        console.log('error from upload :', error)
      })
      .finally(() => {
        // TODO. check if this gives error in the event of a redirect (sucess>home)
        setModalVisible(false)
        setProgress(0)
      })
  }

  function toggleType(bool) {
    setAdType(bool)
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.4,
        // base64: true,
        // allowsMultipleSelection: true,
      })

      // TODO.Future Add imageSize restrictions
      // var stringLength =
      //   result.assets[0].base64.length - 'data:image/png;base64,'.length

      // var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
      // var sizeInKb = sizeInBytes / 1000

      // console.log({ size: sizeInKb })

      if (!result.canceled) {
        setImages((oldState) => [
          ...oldState,
          { id: oldState.length, uri: result.assets[0].uri },
        ])
      }
    } catch (error) {
      console.log('ERROR while selecting files:', error)
    }
  }

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      })

      if (result.canceled) return

      if (result.assets[0]?.duration > 30000) {
        Alert.alert(translate('error.videolength', lang))
        return
      }
      setVideo(result.assets[0].uri)
    } catch (error) {
      console.log('ERROR while selecting files:', error)
    }
  }

  function resetAll() {
    reset()
    setImages([])
    setAdType(true)
    setVideo(null)
  }
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.card,
        padding: 10,
      }}
    >
      <FormLabel label={translate('title', lang)} />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              placeholder={translate('title.placeholder', lang)}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: 'red',
                  borderWidth: error ? 1 : 0,
                  backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                },
              ]}
              placeholderTextColor={getLighterShade(colors.text, 0.4)}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10 }}>
                {translate('error.field.required', lang)}
              </Text>
            )}
          </>
        )}
        name='title'
        rules={{ required: true }}
      />
      <FormLabel label={translate('description', lang)} />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              multiline
              numberOfLines={5}
              placeholder={translate('description.placeholder', lang)}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: 'red',
                  borderWidth: error ? 1 : 0,
                  textAlignVertical: 'top',
                  backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                },
              ]}
              placeholderTextColor={getLighterShade(colors.text, 0.4)}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10 }}>
                {translate('error.field.required', lang)}
              </Text>
            )}
          </>
        )}
        name='description'
        rules={{ required: true }}
      />

      <FormLabel label={translate('category', lang)} />
      <Controller
        control={control}
        name='category'
        defaultValue=''
        render={({ field, fieldState: { error } }) => (
          <View style={{ zIndex: 1 }}>
            <DropDownPicker
              open={open}
              listMode='MODAL'
              searchable
              searchPlaceholder={translate('placeholder', lang)}
              value={field.value}
              categorySelectable={false}
              items={[
                {
                  icon: () => (
                    <IconButton
                      icon='car-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.Vehicles', lang),
                  value: 'vehicle',
                },
                {
                  icon: () => (
                    <IconButton
                      icon='home-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.RealEstate', lang),
                  value: 'realState',
                },
                {
                  icon: () => (
                    <IconButton
                      icon='briefcase-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.jobs', lang),
                  value: 'jobService',
                },
                {
                  icon: () => (
                    <IconButton
                      icon='bed-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.homeAppliance', lang),
                  value: 'home',
                },
                {
                  icon: () => (
                    <IconButton
                      icon='desktop-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.Electronics', lang),
                  value: 'electronics',
                },
                {
                  icon: () => (
                    <IconButton
                      icon='musical-notes-outline'
                      size={24}
                      color={colors.text}
                    />
                  ),
                  label: translate('menu.leisure', lang),
                  value: 'leisure',
                },
                {
                  label: translate(`categories.${CategoryEnum.Car}`, lang),
                  value: CategoryEnum.Car,
                  parent: 'vehicle',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.Motorcycle}`,
                    lang,
                  ),
                  value: CategoryEnum.Motorcycle,
                  parent: 'vehicle',
                },
                {
                  label: translate(`categories.${CategoryEnum.Boat}`, lang),
                  value: CategoryEnum.Boat,
                  parent: 'vehicle',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.PartAndAccessory}`,
                    lang,
                  ),
                  value: CategoryEnum.PartAndAccessory,
                  parent: 'vehicle',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.HouseSale}`,
                    lang,
                  ),
                  value: CategoryEnum.HouseSale,
                  parent: 'realState',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.HouseRent}`,
                    lang,
                  ),
                  value: CategoryEnum.HouseRent,
                  parent: 'realState',
                },
                {
                  label: translate(`categories.${CategoryEnum.Land}`, lang),
                  value: CategoryEnum.Land,
                  parent: 'realState',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.CommercialProperty}`,
                    lang,
                  ),
                  value: CategoryEnum.CommercialProperty,
                  parent: 'realState',
                },
                {
                  label: translate(`categories.${CategoryEnum.Job}`, lang),
                  value: CategoryEnum.Job,
                  parent: 'jobService',
                },
                {
                  label: translate(`categories.${CategoryEnum.Service}`, lang),
                  value: CategoryEnum.Service,
                  parent: 'jobService',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.MachineAndEquipment}`,
                    lang,
                  ),
                  value: CategoryEnum.MachineAndEquipment,
                  parent: 'jobService',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.HomeDecor}`,
                    lang,
                  ),
                  value: CategoryEnum.HomeDecor,
                  parent: 'home',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.HomeAppliance}`,
                    lang,
                  ),
                  value: CategoryEnum.HomeAppliance,
                  parent: 'home',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.AirConditioner}`,
                    lang,
                  ),
                  value: CategoryEnum.AirConditioner,
                  parent: 'home',
                },
                {
                  label: translate(`categories.${CategoryEnum.Clothe}`, lang),
                  value: CategoryEnum.Clothe,
                  parent: 'home',
                },
                {
                  label: translate(
                    `categories.${CategoryEnum.Accessory}`,
                    lang,
                  ),
                  value: CategoryEnum.Accessory,
                  parent: 'home',
                },
                {
                  label: translate(`categories.${CategoryEnum.Computer}`, lang),
                  value: CategoryEnum.Computer,
                  parent: 'electronics',
                },
                {
                  label: translate(`categories.${CategoryEnum.Game}`, lang),
                  value: CategoryEnum.Game,
                  parent: 'electronics',
                },
                {
                  label: translate(`categories.${CategoryEnum.Mobile}`, lang),
                  value: CategoryEnum.Mobile,
                  parent: 'electronics',
                },
                {
                  label: translate(`categories.${CategoryEnum.TV}`, lang),
                  value: CategoryEnum.TV,
                  parent: 'electronics',
                },
                {
                  label: translate(`categories.${CategoryEnum.Sport}`, lang),
                  value: CategoryEnum.Sport,
                  parent: 'leisure',
                },
                {
                  label: translate(`categories.${CategoryEnum.Book}`, lang),
                  value: CategoryEnum.Book,
                  parent: 'leisure',
                },
                {
                  label: translate(`categories.${CategoryEnum.Toy}`, lang),
                  value: CategoryEnum.Toy,
                  parent: 'leisure',
                },
                {
                  label: translate(`categories.${CategoryEnum.Movie}`, lang),
                  value: CategoryEnum.Movie,
                  parent: 'leisure',
                },
              ]}
              setOpen={() => setOpen(!open)}
              onSelectItem={(item) => {
                field.onChange(item.value)
                return item
              }}
              theme={dark ? 'DARK' : 'LIGHT'}
              {...field}
              ref={null}
              placeholder={translate('option.placeholder', lang)}
              closeOnBackPressed
              style={{
                marginBottom: 10,
                borderWidth: 1,
                backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                borderColor: 'red',
                borderWidth: error ? 1 : 0,
              }}
              listParentLabelStyle={{
                fontWeight: 'bold',
                fontSize: 16,
              }}
              listParentContainerStyle={{
                backgroundColor: dark ? colors.card : colors.border,
                opacity: 0.7,
                height: 50,
              }}
            />
            {error && (
              <Text style={{ color: 'red', marginLeft: 15 }}>
                {translate('error.category', lang)}
              </Text>
            )}
          </View>
        )}
        rules={{ required: true }}
      />

      <FormLabel label={translate('adtype', lang)} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
            {translate('forsale', lang)}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
            {translate('wanted', lang)}
          </Text>
        </View>
      </View>

      <FormLabel label={translate('price', lang)} />
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            keyboardType='numeric'
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: 'red',
                borderWidth: error ? 1 : 0,
                backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
              },
            ]}
            placeholder={translate('optional', lang)}
            placeholderTextColor={getLighterShade(colors.text, 0.4)}
            onBlur={() =>
              value && onChange(parseInt(value).toLocaleString('en-US'))
            }
            onChangeText={(value) => onChange(value)}
            value={value}
            onFocus={() => value && onChange(value.replace(/[^0-9]/g, ''))}
          />
        )}
        name='price'
        rules={{ required: false }}
      />

      <FormLabel label={translate('add.images', lang)} />

      <View style={{ flexDirection: 'row' }}>
        <>
          <View style={{ flexDirection: 'row' }}>
            {images.map((image) => (
              <View key={image.id} style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: 100,
                    marginHorizontal: 10,
                    height: 100,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                />
                <IconButton
                  color='red'
                  icon='trash-outline'
                  size={25}
                  onPress={() =>
                    setImages(images.filter((f) => f.id !== image.id))
                  }
                />
              </View>
            ))}
          </View>
          {images.length < 3 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                width: 100,
                marginHorizontal: images.length === 0 ? 0 : 10,
                borderColor: colors.border,
                backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                borderWidth: 1,
              }}
            >
              <IconButton
                onPress={pickImage}
                icon='md-add-sharp'
                size={40}
                color={colors.text}
              />
            </View>
          )}
        </>
      </View>

      {images.length > 0 && (
        <>
          <FormLabel label={translate('add.video', lang)} />

          <View style={{ alignItems: 'flex-start' }}>
            {videoUri ? (
              <View style={{ alignItems: 'center' }}>
                <Video
                  ref={video}
                  isMuted
                  style={{
                    margin: 10,
                    width: 200,
                    height: 200,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  source={{
                    uri: videoUri,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  shouldPlay
                  onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
                <IconButton
                  color='red'
                  icon='trash-outline'
                  size={25}
                  onPress={() => setVideo(null)}
                />
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  width: 200,
                  borderColor: colors.border,
                  backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                  borderWidth: 1,
                }}
              >
                <IconButton
                  onPress={pickVideo}
                  icon='md-add-sharp'
                  size={40}
                  color={colors.text}
                />
              </View>
            )}
          </View>
        </>
      )}

      <FormLabel label={translate('phone', lang)} />
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              keyboardType='numeric'
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: 'red',
                  borderWidth: error ? 1 : 0,
                  backgroundColor: COLORS[dark ? 'dark' : 'light'].inputBG,
                },
              ]}
              placeholder='77 .. .. .. '
              placeholderTextColor={getLighterShade(colors.text, 0.4)}
              onBlur={() => value && onChange(value.replace(/(.{2})/g, '$1 '))}
              onChangeText={(value) => onChange(value)}
              value={value}
              onFocus={() => value && onChange(value.replace(/[^0-9]/g, ''))}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10, paddingLeft: 15 }}>
                {translate('error.phone', lang)}
              </Text>
            )}
          </>
        )}
        name='phone'
        rules={{
          validate: (value) => {
            const phone = value?.replace(/[^0-9]/g, '') ?? ''
            return phone.startsWith('77') && phone.length === 8
          },
        }}
      />

      <View style={styles.button}>
        <CustomButton text={translate('reset', lang)} onPress={resetAll} />
        <CustomButton
          isSelected
          text={translate('submit', lang)}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <Progressoverlay
        progress={progress}
        visible={modalVisible}
        title={translate('upload.message', lang)}
      />
    </ScrollView>
  )
}

const Stack = createNativeStackNavigator()

function NewStack() {
  const routeName = useStore((state) => state.routeName)
  const lang = useStore((state) => state.lang)
  const { dark } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        animation: 'slide_from_right',
        title: translate(handleRoutetitle(routeName), lang),
        headerStyle: {
          backgroundColor: COLORS[dark ? 'dark' : 'light'].dominant,
        },
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
                : navigation.getParent().openDrawer()
            }}
          />
        ),
      })}
    >
      <Stack.Screen name={ROUTES.NEW_AD_STACK} component={NewAd} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
  },
})

export default NewStack
