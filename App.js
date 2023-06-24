import 'react-native-gesture-handler'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Appearance, Platform, UIManager } from 'react-native'
import { useStore } from '@zustand/store'
import { useEffect, useRef } from 'react'
import DrawerNav from '@navigation/DrawerNav'
// import { useEffect } from 'react'
// import { useStore } from '@zustand/store'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function App() {
  // const theme = Appearance.getColorScheme()
  const theme = useStore((state) => state.theme)
  const swithTheme = useStore((state) => state.swithTheme)

  useEffect(() => {
    // check locaStorage for a value
    // use that value
    // if !value then it is the firstTime so get the devicePreference
    swithTheme(Appearance.getColorScheme())
    // TODO. when a user explicitly changes the theme
    // save in localStorage and update the zustandStore
  }, [])
  // TODO.find a way to avoid the shift of the drawer toggle in homepage

  const _routeNameRef = useRef()
  const _navigationRefRoot = useRef()

  const setRouteName = useStore((state) => state.setRouteName)

  return (
    <>
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
            currentRouteName = _navigationRefRoot.current.getCurrentRoute().name
          }
          if (previousRouteName !== currentRouteName) {
            // TODO.log screen visit
            // firebaseAnalytics()
            //   .logScreenView({
            //     screen_name: currentRouteName,
            //     screen_class: currentRouteName,
            //   })
            //   .catch(() => undefined);
            console.log('Screenn changed')
            // Hide default bottom Tab header for all the nested stack navigator
            setRouteName(currentRouteName)
          }

          _routeNameRef.current = currentRouteName
        }}
      >
        <DrawerNav />
      </NavigationContainer>
    </>
  )
}
