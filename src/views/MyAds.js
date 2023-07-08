import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import { ROUTES } from '@constants/routes'
import { useNavigation } from '@react-navigation/native'
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
} from 'react-native'

import { SwipeListView } from 'react-native-swipe-list-view'
import { useMutation, useQuery } from 'react-query'
import Ad from './Ad'

function MyProfile() {
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

  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => navigate(ROUTES.HOME_AD, { id: data.item.id })}
      style={styles.rowFront}
      underlayColor={'#AAA'}
    >
      <View>
        <Text>{data.item.title}</Text>
      </View>
    </TouchableHighlight>
  )

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
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
    <View style={styles.container}>
      <Text style={styles.title}>My ads</Text>

      <SwipeListView
        data={ads.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have not posted any ads</Text>
        }
        disableRightSwipe
        rightOpenValue={-50}
        previewRowKey={ads.data?.[0]?.id}
        previewOpenValue={-50}
        previewOpenDelay={3000}
        previewDuration={2000}
        onRowDidOpen={onRowDidOpen}
        swipeRowStyle={styles.swipedStyle}
        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
      />
    </View>
  )
}

const Stack = createNativeStackNavigator()

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
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
    padding: 10,
  },
  title: {
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  emptyText: {
    marginTop: 30,
    textAlign: 'center',
  },
  rowFront: {
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#c2bfbf',
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
  },
  rowBack: {
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  swipedStyle: {
    borderRadius: 20,
    overflow: 'hidden',
  },
})

export default ProfileStack
