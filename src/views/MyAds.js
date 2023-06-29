import React, { useState, useEffect } from 'react'
import { Button, Image, View, Platform, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Video, ResizeMode } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import IconButton from '@components/IconButton'

function VideoComp() {
  const { colors } = useTheme()
  const video = React.useRef(null)
  const [status, setStatus] = React.useState({})
  const [videoUri, setVideo] = useState(null)

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      })

      console.log(result)
      // console.log({ size: sizeInKb })

      // TODO. find a way to verify video length (up to 30s)
      if (!result.canceled) {
        setVideo(result.assets[0].uri)
      }
    } catch (error) {
      console.log('ERROR while selecting files:', error)
    }
  }

  return (
    <View style={{ alignItems: 'flex-start' }}>
      {videoUri ? (
        <View style={{ alignItems: 'center' }}>
          <Video
            ref={video}
            isMuted
            style={{
              margin: 10,
              width: 100,
              height: 100,
              borderColor: colors.border,
              borderWidth: 1,
            }}
            source={{
              uri: videoUri,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
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
            height: 100,
            width: 100,
            marginHorizontal: 10,
            borderColor: colors.border,
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
  )
}

export default function ImagePickerExample() {
  const [images, setImages] = useState([])
  const { colors } = useTheme()

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,

        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.4,
        // base64: true,
        // allowsMultipleSelection: true,
      })

      // TODO.make this a utils function (pick up to 3 images)
      // var stringLength =
      //   result.assets[0].base64.length - 'data:image/png;base64,'.length

      // var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
      // var sizeInKb = sizeInBytes / 1000

      console.log(result)
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
  console.log(images)

  // TODO. add shadow if in light mode
  // TODO.IOS Add permissions handling for IOS()
  return (
    <View style={{ flex: 0 }}>
      <Text
        style={{
          margin: 20,
          height: 50,
          color: colors.text,
          backgroundColor: colors.primary,
        }}
      >
        Pick images (Up to 3)
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <>
          <View style={{ flexDirection: 'row' }}>
            {images.map((image) => (
              <View style={{ alignItems: 'center' }}>
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
                marginHorizontal: 10,
                borderColor: colors.border,
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
      <Text
        style={{
          margin: 20,
          height: 50,
          color: colors.text,
          backgroundColor: colors.primary,
        }}
      >
        Pick a video
      </Text>
      <VideoComp />
    </View>
  )
}
