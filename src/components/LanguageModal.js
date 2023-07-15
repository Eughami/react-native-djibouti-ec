import { languageOptions, sortOptions, themeOptions } from '@constants/common'
import { useTheme } from '@react-navigation/native'
import { Appearance, Modal, Pressable, Text, View } from 'react-native'
import SelectedOption from './SelectedOption'
import { useStore } from '@zustand/store'
import translate from '@lang/translate'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'

function LangModal({ isOpen, toggleFunc, isLang = false, callback }) {
  const lang = useStore((state) => state.lang)
  const swithTheme = useStore((state) => state.swithTheme)
  const setLang = useStore((state) => state.setLang)

  const { colors, dark } = useTheme()
  const [theme, setTheme] = useState(themeOptions[0])
  const [selectedLang, setSelectedLang] = useState(languageOptions[0])

  useEffect(() => {
    const fetchConf = async () => {
      if (isLang) {
        const localLang = await AsyncStorage.getItem('lang')
        if (localLang) setSelectedLang(localLang)
        // else setSelectedLang(lang)
      } else {
        const localTheme = await AsyncStorage.getItem('theme')
        if (localTheme) setTheme(localTheme)
      }
    }
    fetchConf()
  }, [])

  const handleThemeChange = async (option) => {
    if (option === theme) return
    // ?AUTO
    if (option === themeOptions[0]) {
      AsyncStorage.removeItem('theme').then(() => {
        swithTheme(Appearance.getColorScheme())
        toggleFunc()
      })
    } else {
      AsyncStorage.setItem('theme', option).then(() => {
        swithTheme(option)
        toggleFunc()
      })
    }
  }
  const handleLanguageChange = (option) => {
    if (option === selectedLang) return

    // ?AUTO
    if (option === languageOptions[0]) {
      AsyncStorage.removeItem('lang').then(() => {
        setLang(getLocales()[0].languageCode)
        toggleFunc()
      })
    } else {
      AsyncStorage.setItem('lang', option).then(() => {
        setLang(option)
        toggleFunc()
      })
    }
  }
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType='slide'
      onRequestClose={toggleFunc}
    >
      <Pressable
        onPress={toggleFunc}
        style={{
          flex: 1,
          backgroundColor: dark ? 'rgba(1, 1, 1, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            minWidth: 250,
            backgroundColor: dark ? colors.border : colors.card,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              margin: 15,
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {translate(`${isLang ? 'lang' : 'theme'}.choose`, lang)}
          </Text>
          {isLang
            ? languageOptions.map((l) => (
                <SelectedOption
                  key={l}
                  text={translate(`lang.${l}`, lang)}
                  toggleFunc={() => handleLanguageChange(l)}
                  isSelected={l === selectedLang}
                />
              ))
            : themeOptions.map((th) => (
                <SelectedOption
                  key={th}
                  text={translate(`theme.${th}`, lang)}
                  toggleFunc={() => handleThemeChange(th)}
                  isSelected={th === theme}
                />
              ))}
        </View>
      </Pressable>
    </Modal>
  )
}

export default LangModal
