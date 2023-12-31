import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import { ROUTES } from '@constants/routes'
import { useNavigation, useTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { deleteAd, getMyAds, updateDevice } from '@services/home'
import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ToastAndroid,
  Image,
  Modal,
  Pressable,
  Switch,
} from 'react-native'

import { SwipeListView } from 'react-native-swipe-list-view'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Ad from './Ad'
import { API_BASE_URL } from '@constants/api'
import { COLORS } from '@constants/style'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '@zustand/store'
import translate from '@lang/translate'
import { handleRoutetitle, whichTextToShow } from '@constants/common'
import CustomButton from '@components/CustomButton'

function MyProfile() {
  const notisOn = useStore((state) => state.notisOn)
  const debounceTimeoutRef = useRef(null)
  const queryClient = useQueryClient()
  const [enabled, setEnaled] = useState(notisOn)
  const [isOpen, setIsOpen] = useState(false)
  const [delId, setDelId] = useState(null)
  const { dark, colors } = useTheme()
  const lang = useStore((state) => state.lang)
  const { navigate } = useNavigation()
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const toggleFunc = () => setIsOpen(!isOpen)

  const {
    isLoading,
    isFetching,
    data: ads,
    refetch,
  } = useQuery('my-ads', () => getMyAds())

  const { mutate: deleteMutation, isLoading: deleteLoading } = useMutation(
    deleteAd,
    {
      onSuccess: (deleteData) => {
        if (!deleteData) {
          setDelId(null)
          toggleFunc()
          // ? Show toast
          // ToastAndroid.showWithGravity(
          //   'Ad deleted successfully',
          //   ToastAndroid.SHORT,
          //   ToastAndroid.CENTER,
          // )
          refetch()
        }
      },
    },
  )

  const { mutate: updateMutation, isLoading: mutationLoading } = useMutation(
    updateDevice,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('fav-cat')
      },
    },
  )

  const debounceUpdate = () => {
    if (mutationLoading) {
      return // Ignore button press if a request is already pending
    }

    // Clear the previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set a new timeout of 1 second
    debounceTimeoutRef.current = setTimeout(() => {
      updateMutation(enabled)
    }, 3000)
    setEnaled(!enabled)
  }

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey)
    deleteMutation(rowKey)
  }

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey)
  }

  // TODO. make forground/background the same as newad page
  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => navigate(ROUTES.HOME_AD, { id: data.item.id })}
      underlayColor={'#AAA'}
    >
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: dark ? colors.border : colors.background },
        ]}
      >
        <Image
          style={{
            marginHorizontal: 10,
            width: 60,
            height: 60,
            resizeMode: 'contain',
          }}
          source={
            data.item?.attachment.find((at) => at?.position === 0)?.path
              ? {
                  uri: `${API_BASE_URL}/files/${
                    data.item.attachment.find((at) => at.position === 0).path
                  }`,
                }
              : require('@assets/default.jpg')
          }
        />
        <View
          style={{
            flex: 1,
            marginRight: 10,
            // borderColor: 'red',
            justifyContent: 'space-around',
            // borderWidth: 1,
            height: 55,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}
          >
            {whichTextToShow(data.item, lang)}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.text }}>
            {whichTextToShow(data.item, lang, true)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  const renderHiddenItem = (data, rowMap) => (
    <View
      style={[
        styles.rowBack,
        {
          marginLeft: 20,
          backgroundColor: COLORS[dark ? 'dark' : 'light'].delete,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          {
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => {
          setDelId(data.item.id)
          toggleFunc()
        }}
      >
        <IconButton
          color='white'
          icon='trash-outline'
          size={25}
          nopad
          onPress={() => {
            setDelId(data.item.id)
            toggleFunc()
          }}
        />
        <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
          {translate('delete', lang)}
        </Text>
      </Pressable>
    </View>
  )

  const loading = isFetching && isLoading
  if (loading) return <Loader />

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: colors.card }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 16 }}>
          {translate('categories.updates', lang)}
        </Text>
        <Switch onValueChange={debounceUpdate} value={enabled} />
      </View>
      <Text
        style={[
          styles.subtitle,
          {
            color: colors.text,
          },
        ]}
      >
        {translate('routes.MyAds', lang)}
      </Text>
      <SwipeListView
        style={{
          flex: 1,
        }}
        data={ads?.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {translate('error.noads', lang)}
          </Text>
        }
        disableRightSwipe
        rightOpenValue={-60}
        previewRowKey={ads?.data?.[0]?.id}
        previewOpenValue={-60}
        previewOpenDelay={3000}
        previewDuration={1000}
        onRowDidOpen={onRowDidOpen}
        swipeRowStyle={styles.swipedStyle}
        ItemSeparatorComponent={<View style={{ height: 15 }}></View>}
      />
      <Modal
        visible={isOpen}
        animationType='fade'
        transparent={true}
        onRequestClose={toggleFunc}
      >
        <Pressable
          onPress={toggleFunc}
          style={{
            flex: 1,
            backgroundColor: dark ? 'rgba(1, 1, 1, 0.6)' : 'rgba(0, 0, 0, 0.6)',
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
              {translate('warning.delete', lang)}
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <CustomButton
                onPress={toggleFunc}
                text={translate('cancel', lang)}
              />
              <CustomButton
                onPress={() => deleteMutation(delId)}
                text={translate('yes', lang)}
                color='white'
                bg={COLORS[dark ? 'dark' : 'light'].delete}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
// TODO.Add toggle for notification and some view for the favorite categories
const Stack = createNativeStackNavigator()

function ProfileStack() {
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
                : navigation.toggleDrawer()
            }}
          />
        ),
      })}
    >
      <Stack.Screen name={ROUTES.PROFILE} component={MyProfile} />
      <Stack.Screen name={ROUTES.HOME_AD} component={Ad} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  subtitle: {
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyText: {
    marginTop: 30,
    textAlign: 'center',
  },
  rowFront: {},
  rowBack: {
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    // backgroundColor: '#8B0000', //dark
    backgroundColor: '#DC143C', //light
    height: 70,
  },
  swipedStyle: {
    height: 70,
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 20,
    height: 70,
    overflow: 'hidden',
  },
})

export default ProfileStack
