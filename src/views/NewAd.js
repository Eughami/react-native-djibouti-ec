import { useTheme } from '@react-navigation/native'
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
import { COLORS } from '@constants/style'
import * as ImagePicker from 'expo-image-picker'
import FormLabel from '@components/FormLabel'
import { Video, ResizeMode } from 'expo-av'
import { CategoryEnum } from '@constants/categories'
import Progressoverlay from '@components/ProgressOverlay'
import axiosInstance from '@constants/axiosInstance'

function NewAd() {
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
    axiosInstance({
      url: '/api/v1/ads',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        const axiosProgress = Math.round((loaded * 100) / total)
        setProgress(axiosProgress)
      },
    })
      .then(function (response) {
        console.log('response :', response)
        setModalVisible(false)
        resetAll()
        // TODO.change the content of the modal to show a close button with a success msg (?redirect to home?)
        Alert.alert('Your Ad is live!')
      })
      .catch(function (error) {
        setModalVisible(false)
        // TODO.make it modular in the future
        let msg = 'Something went wrong'
        let sub = 'Check your fields values and try again.'
        switch (error?.statusCode) {
          case 413:
            msg = 'File too large'
            sub = 'Size limit for images/videos is 20MB.'
            break

          default:
            break
        }
        Alert.alert(msg, sub)
        console.log('error from upload :', error)
      })
      .finally(() => {
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
        Alert.alert('maximum video length is 30 sec')
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
        paddingBottom: 20,
      }}
    >
      <FormLabel label='Title' />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              placeholder='Title of the Ad'
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: error ? 'red' : colors.border,
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
                },
              ]}
              placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10 }}>
                {error?.message || 'this field is required'}
              </Text>
            )}
          </>
        )}
        name='title'
        rules={{ required: 'title is required' }}
      />
      <FormLabel label='Description' />
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
              placeholder='Describe what you are selling or or what you are offering.'
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: error ? 'red' : colors.border,
                  textAlignVertical: 'top',
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
                },
              ]}
              placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10 }}>
                {error?.message || 'This field is required'}
              </Text>
            )}
          </>
        )}
        name='description'
        rules={{ required: 'A Description of the ad is required' }}
      />

      <FormLabel label='Category' />
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
                  label: 'Vehicles',
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
                  label: 'Real Estate',
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
                  label: 'Jobs & Services',
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
                  label: 'Home & Personal Items',
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
                  label: 'Electronics',
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
                  label: 'Leisure, Sports & Hobby',
                  value: 'leisure',
                },
                {
                  label: CategoryEnum.Car,
                  value: CategoryEnum.Car,
                  parent: 'vehicle',
                },
                {
                  label: CategoryEnum.Motorcycle,
                  value: CategoryEnum.Motorcycle,
                  parent: 'vehicle',
                },
                {
                  label: CategoryEnum.Boat,
                  value: CategoryEnum.Boat,
                  parent: 'vehicle',
                },
                {
                  label: CategoryEnum.PartAndAccessory,
                  value: CategoryEnum.PartAndAccessory,
                  parent: 'vehicle',
                },
                {
                  label: CategoryEnum.HouseSale,
                  value: CategoryEnum.HouseSale,
                  parent: 'realState',
                },
                {
                  label: CategoryEnum.HouseRent,
                  value: CategoryEnum.HouseRent,
                  parent: 'realState',
                },
                {
                  label: CategoryEnum.Land,
                  value: CategoryEnum.Land,
                  parent: 'realState',
                },
                {
                  label: CategoryEnum.CommercialProperty,
                  value: CategoryEnum.CommercialProperty,
                  parent: 'realState',
                },
                {
                  label: CategoryEnum.Job,
                  value: CategoryEnum.Job,
                  parent: 'jobService',
                },
                {
                  label: CategoryEnum.Service,
                  value: CategoryEnum.Service,
                  parent: 'jobService',
                },
                {
                  label: CategoryEnum.MachineAndEquipment,
                  value: CategoryEnum.MachineAndEquipment,
                  parent: 'jobService',
                },
                {
                  label: CategoryEnum.HomeDecor,
                  value: CategoryEnum.HomeDecor,
                  parent: 'home',
                },
                {
                  label: CategoryEnum.HomeAppliance,
                  value: CategoryEnum.HomeAppliance,
                  parent: 'home',
                },
                {
                  label: CategoryEnum.AirConditioner,
                  value: CategoryEnum.AirConditioner,
                  parent: 'home',
                },
                {
                  label: CategoryEnum.Clothe,
                  value: CategoryEnum.Clothe,
                  parent: 'home',
                },
                {
                  label: CategoryEnum.Accessory,
                  value: CategoryEnum.Accessory,
                  parent: 'home',
                },
                {
                  label: CategoryEnum.Computer,
                  value: CategoryEnum.Computer,
                  parent: 'electronics',
                },
                {
                  label: CategoryEnum.Game,
                  value: CategoryEnum.Game,
                  parent: 'electronics',
                },
                {
                  label: CategoryEnum.Mobile,
                  value: CategoryEnum.Mobile,
                  parent: 'electronics',
                },
                {
                  label: CategoryEnum.TV,
                  value: CategoryEnum.TV,
                  parent: 'electronics',
                },
                {
                  label: CategoryEnum.Sport,
                  value: CategoryEnum.Sport,
                  parent: 'leisure',
                },
                {
                  label: CategoryEnum.Book,
                  value: CategoryEnum.Book,
                  parent: 'leisure',
                },
                {
                  label: CategoryEnum.Toy,
                  value: CategoryEnum.Toy,
                  parent: 'leisure',
                },
                {
                  label: CategoryEnum.Movie,
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
              placeholder='Select an option'
              closeOnBackPressed
              style={{
                marginBottom: 10,
                borderWidth: 1,
                backgroundColor: dark ? '#2b2e3dff' : colors.background,
                borderColor: error ? 'red' : colors.border,
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
              <Text style={{ color: 'red' }}>
                {error.message || 'This field is required'}
              </Text>
            )}
          </View>
        )}
        rules={{ required: 'Choose a category for your Ad' }}
      />

      <FormLabel label='Ad Type' />
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
            For Sale
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
            Wanted
          </Text>
        </View>
      </View>

      <FormLabel label='Price (FDJ)' />
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            keyboardType='numeric'
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: error ? 'red' : colors.border,
                backgroundColor: dark ? '#2b2e3dff' : colors.background,
              },
            ]}
            placeholder='Optional'
            placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
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

      <FormLabel label='Add Images (Up to 3)' />

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
                backgroundColor: dark ? '#2b2e3dff' : colors.background,
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
          <FormLabel label='Add a video (Up to 30 sec)' />

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
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
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

      <FormLabel label='Phone' />
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
                  borderColor: error ? 'red' : colors.border,
                  backgroundColor: dark ? '#2b2e3dff' : colors.background,
                },
              ]}
              placeholder='77 .. .. .. '
              placeholderTextColor={dark ? '#8a8a8a' : '#535353'}
              onBlur={() => value && onChange(value.replace(/(.{2})/g, '$1 '))}
              onChangeText={(value) => onChange(value)}
              value={value}
              onFocus={() => value && onChange(value.replace(/[^0-9]/g, ''))}
            />
            {error && (
              <Text style={{ color: 'red', padding: 10 }}>
                {error.message || 'This field is required'}
              </Text>
            )}
          </>
        )}
        name='phone'
        rules={{
          validate: (value) => {
            const phone = value?.replace(/[^0-9]/g, '') ?? ''
            return (
              (phone.startsWith('77') && phone.length === 8) ||
              'A valid djiboutian phone number is required for your Ad'
            )
          },
        }}
      />

      <View style={styles.button}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Button
            style={styles.buttonInner}
            color={dark ? '#2b2e3dff' : colors.border}
            title='Reset'
            onPress={() => {
              resetAll()
            }}
          />
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Button
            style={styles.buttonInner}
            title='Submit'
            onPress={handleSubmit(onSubmit)}
            // onPress={test}
          />
        </View>
      </View>
      <Progressoverlay
        progress={progress}
        visible={modalVisible}
        title='Your files are being uploaded ...'
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {},
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
    color: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
  },
})

export default NewAd
