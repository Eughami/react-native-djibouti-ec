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
import { errorLog, postLogs, updateLang } from '@services/log'
import { getLocales } from 'expo-localization'
import translate from '@lang/translate'
import { ROUTES } from '@constants/routes'
import { NotificationTypeEnum } from '@constants/categories'
import * as Linking from 'expo-linking'
import { dd, deepLinkingCategories } from '@constants/common'

const prefix = Linking.createURL('/')

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const queryClient = new QueryClient()

async function registerForPushNotificationsAsync(lang) {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert(translate('error.no.notification.access', lang))
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert(translate('error.real.device', lang))
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
  const setLang = useStore((state) => state.setLang)
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
      let lang = await AsyncStorage.getItem('lang')
      console.log({ lang })
      try {
        log['initialStorage'] = performance.now() - st
        log['tt'] = performance.now()

        // ? If no language is set just use the local + update the device.lang in BE
        if (!lang) {
          lang = getLocales()[0].languageCode
        }
        // Fetch deviceInfo,pushToken and save in BE to get an ID
        if (!deviceId) {
          const token = await registerForPushNotificationsAsync(lang)
          const device = await axiosInstance({
            method: 'POST',
            url: '/devices',
            data: { ...Device, token, lang },
          })
          log['isFirstTime'] = true
          log['apiCall'] = performance.now() - log['tt']
          log['tt'] = performance.now()

          deviceId = device.id
          await AsyncStorage.setItem('deviceId', deviceId)
        }
        if (!theme) {
          theme = Appearance.getColorScheme()
          log['theme'] = performance.now() - log['tt']
        }
        setDeviceId(deviceId)
        swithTheme(theme)
        setLang(lang)
        updateLang(lang)
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
          linking={{
            prefixes: [prefix, 'eughami://'],
            config: {
              screens: {
                [ROUTES.BOTTOM_TAB_ROUTES]: {
                  path: ROUTES.BOTTOM_TAB_ROUTES,
                  screens: {
                    [ROUTES.HOME_STACK]: {
                      path: ROUTES.HOME_STACK,
                      initialRouteName: ROUTES.HOME,
                      screens: { ...deepLinkingCategories() },
                    },
                    [ROUTES.SEARCH_STACK]: {
                      path: ROUTES.SEARCH_STACK,
                      initialRouteName: ROUTES.SEARCH,
                      screens: {
                        Search: 'Search',
                        [ROUTES.HOME_AD]: {
                          path: 'Home.Ad/:id',
                        },
                      },
                    },
                  },
                },
              },
            },
            async getInitialURL() {
              // TODO.Fix the notifications
              // First, you may want to do the default deep link handling
              // Check if app was opened from a deep link
              let url = await Linking.getInitialURL()
              console.log(url)
              if (url != null) {
                return url
              }

              // Handle URL from expo push notifications
              const response =
                await Notifications.getLastNotificationResponseAsync()

              const data = response?.notification.request.content.data ?? null
              if (data?.type === NotificationTypeEnum.singleCategory)
                url = `eughami://${ROUTES.BOTTOM_TAB_ROUTES}/${ROUTES.HOME_STACK}/${ROUTES.HOME_CATEGORY}.${data.category}/${data.category}`

              console.log('INITIAL URL : ', data)
              // if (data) return `${ROUTES.HOME_CATEGORY}.${data.category}`
              return url
            },
            subscribe(listener) {
              const onReceiveURL = ({ url }) => listener(url)

              // Listen to incoming links from deep linking
              const eventListenerSubscription = Linking.addEventListener(
                'url',
                onReceiveURL,
              )

              // Listen to expo push notifications
              const subscription =
                Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    let url = null
                    const data =
                      response?.notification.request.content.data ?? null

                    // Any custom logic to see whether the URL needs to be handled
                    //...
                    console.log('LISTENER : ', data)

                    if (data?.type === NotificationTypeEnum.singleCategory)
                      url = `eughami://${ROUTES.BOTTOM_TAB_ROUTES}/${ROUTES.HOME_STACK}/${ROUTES.HOME_CATEGORY}.${data.category}/${data.category}`
                    // url = `eughami://${ROUTES.SEARCH}`

                    console.log({ url })
                    // Let React Navigation handle the URL
                    // const deepLinkUrl = Linking.createURL(ROUTES.SEARCH_STACK)
                    // Linking.openURL(deepLinkUrl)
                    listener(url)
                  },
                )

              return () => {
                // Clean up the event listeners
                eventListenerSubscription.remove()
                subscription.remove()
              }
            },
          }}
        >
          <DrawerNav />
        </NavigationContainer>
      </QueryClientProvider>
    </View>
  )
}
