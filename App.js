import 'react-native-gesture-handler'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Appearance, Platform, UIManager, View } from 'react-native'
import { useStore } from '@zustand/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import DrawerNav from '@navigation/DrawerNav'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import axiosInstance from '@constants/axiosInstance'
import { errorLog, postLogs } from '@services/log'

// username test
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const queryClient = new QueryClient()

async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const theme = useStore((state) => state.theme)
  const swithTheme = useStore((state) => state.swithTheme)
  const setDeviceId = useStore((state) => state.setDeviceId)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // INFO. This is when notification is received
        console.log('NotificationReceivedListener : ', notification)
      })

    responseListener.current =
      // INFO. This is when notification is clicked
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          'NotificationResponseReceivedListener ',
          JSON.stringify(response),
        )
      })

    const fetchConfigs = async () => {
      const st = performance.now()
      const log = {}
      let deviceId = await AsyncStorage.getItem('deviceId')
      let theme = await AsyncStorage.getItem('theme')
      try {
        log['initialStorage'] = performance.now() - st
        log['tt'] = performance.now()

        // Fetch deviceInfo,pushToken and save in BE to get an ID
        if (!deviceId) {
          const token = await registerForPushNotificationsAsync()
          const device = await axiosInstance({
            method: 'POST',
            url: '/devices',
            data: { ...Device, token },
          })
          log['isFirstTime'] = true
          log['apiCall'] = performance.now() - log['tt']
          log['tt'] = performance.now()

          deviceId = device.id
          await AsyncStorage.setItem('deviceId', deviceId)
        }
        if (!theme) {
          theme = Appearance.getColorScheme()
          await AsyncStorage.setItem('theme', theme)
          log['theme'] = performance.now() - log['tt']
        }
        setDeviceId(deviceId)
        swithTheme(theme)
        delete log['tt']
        log['total'] = performance.now() - st
      } catch (error) {
        errorLog({ ...error, msg: 'something went wrong on startup' }, null)
      }
      setAppIsReady(true)
      postLogs({ type: 'INITIAL_LOAD', payload: log })
    }
    // AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys))
    fetchConfigs()
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  const _routeNameRef = useRef()
  const _navigationRefRoot = useRef()

  const setRouteName = useStore((state) => state.setRouteName)

  if (!appIsReady) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style='auto' translucent={true} />
        <NavigationContainer
          theme={theme === 'dark' ? DarkTheme : DefaultTheme}
          ref={_navigationRefRoot}
          onReady={() => {
            if (_navigationRefRoot?.current?.getCurrentRoute) {
              _routeNameRef.current =
                _navigationRefRoot.current.getCurrentRoute().name
              setRouteName(_routeNameRef.current)
            }
          }}
          onStateChange={({}) => {
            const previousRouteName = _routeNameRef.current

            let currentRouteName = ''
            if (_navigationRefRoot?.current?.getCurrentRoute) {
              currentRouteName =
                _navigationRefRoot.current.getCurrentRoute().name
            }
            if (previousRouteName !== currentRouteName) {
              postLogs({
                type: 'PAGE_VISIT',
                payload: currentRouteName,
              })
              // Hide default bottom Tab header for all the nested stack navigator
              setRouteName(currentRouteName)
            }

            _routeNameRef.current = currentRouteName
          }}
        >
          <DrawerNav />
        </NavigationContainer>
      </QueryClientProvider>
    </View>
  )
}
