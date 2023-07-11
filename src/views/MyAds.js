import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import { ROUTES } from '@constants/routes'
import { useNavigation, useTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { deleteAd, getMyAds } from '@services/home'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ToastAndroid,
  Image,
} from 'react-native'

import { SwipeListView } from 'react-native-swipe-list-view'
import { useMutation, useQuery } from 'react-query'
import Ad from './Ad'
import { API_BASE_URL } from '@constants/api'
import { COLORS } from '@constants/style'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '@zustand/store'

function MyProfile() {
  const { dark, colors } = useTheme()
  const { navigate } = useNavigation()
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

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
          ToastAndroid.showWithGravity(
            'Ad deleted successfully',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )
          refetch()
        }
      },
    },
  )

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
            width: 70,
            height: 70,
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
            height: 60,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}
          >
            {data.item.title}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.text }}>
            {data.item.description}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  const renderHiddenItem = (data, rowMap) => (
    <View style={[styles.rowBack, {}]}>
      <IconButton
        color='red'
        icon='trash-outline'
        size={25}
        onPress={() => deleteRow(rowMap, data.item.id)}
      />
      {/* <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity> */}
    </View>
  )

  const loading = isFetching && isLoading
  if (loading) return <Loader />

  return (
    <SwipeListView
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: colors.card,
      }}
      data={ads.data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.text }]}>
          You have not posted any ads
        </Text>
      }
      disableRightSwipe
      rightOpenValue={-50}
      previewRowKey={ads.data?.[0]?.id}
      previewOpenValue={-50}
      previewOpenDelay={3000}
      previewDuration={1000}
      onRowDidOpen={onRowDidOpen}
      swipeRowStyle={styles.swipedStyle}
      ItemSeparatorComponent={<View style={{ height: 15 }}></View>}
    />
  )
}
// TODO.Add toggle for notification and some view for the favorite categories
const Stack = createNativeStackNavigator()

function ProfileStack() {
  const routeName = useStore((state) => state.routeName)
  const { dark } = useTheme()
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
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
      <Stack.Screen name={ROUTES.MY_ADS} component={MyProfile} />
      <Stack.Screen name={ROUTES.HOME_AD} component={Ad} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
    height: 80,
  },
  swipedStyle: {
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 20,
    height: 80,
    overflow: 'hidden',
  },
})

export default ProfileStack
