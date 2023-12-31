import { API_BASE_URL } from '@constants/api'
import { whichTextToShow } from '@constants/common'
import { ROUTES } from '@constants/routes'
import { COLORS, formatPrice } from '@constants/style'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useStore } from '@zustand/store'
import * as React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  useColorScheme,
} from 'react-native'

function Preview(item) {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const { dark } = useTheme()
  const { title, price, isPremium, attachment = [] } = item
  const lang = useStore((state) => state.lang)

  let imageUrl = undefined
  if (attachment.length > 0) {
    imageUrl = attachment.find((at) => at?.position === 0)?.path
  }
  // console.log(`${API_BASE_URL}/files/${attachment?.[0]?.path}`)
  return (
    <View style={[styles.root, item.small && { margin: 8 }]}>
      <View style={[styles.container, styles[colorScheme]]}>
        <Pressable
          onPress={() => {
            navigation.navigate(ROUTES.HOME_AD, { id: item.id })
          }}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          {imageUrl ? (
            <Image
              style={styles.image}
              source={{
                uri: `${API_BASE_URL}/files/${imageUrl}`,
              }}
            />
          ) : (
            <Image
              style={styles.image}
              source={require('@assets/default.jpg')}
            />
          )}
          {isPremium && (
            <View
              style={[
                styles.ribbon,
                { backgroundColor: COLORS[dark ? 'dark' : 'light'].dominant },
              ]}
            >
              <Text style={styles.ribbonText}> Premium </Text>
            </View>
          )}
          {price && (
            <View
              style={[
                styles.price,
                {
                  backgroundColor: COLORS[dark ? 'dark' : 'light'].secondary,
                },
                item.small && { paddingHorizontal: 4, paddingVertical: 4 },
              ]}
            >
              <Text style={[styles.priceText, item.small && { fontSize: 12 }]}>
                {formatPrice(price)} FDJ
              </Text>
            </View>
          )}

          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.text}>
              {whichTextToShow(item, lang)}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}

export default Preview

const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 15,
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 15,
    width: '100%',
    height: 200,
  },
  dark: {
    // ADD custom shadow effect for darkMode
    borderWidth: 0.5,
    borderColor: '#6d6969',
  },
  light: {
    elevation: 4, // Android shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4, // iOS shadow
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  textContainer: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: 40,
    width: '100%',
    bottom: 0,
  },

  text: {
    paddingHorizontal: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  ribbon: {
    position: 'absolute',
    top: 10, // Adjust the top position as per your requirement
    left: -25, // Adjust the left position as per your requirement
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-45deg' }],
  },
  ribbonText: {
    color: 'white', // Customize the ribbon text color
    fontSize: 12,
    paddingHorizontal: 10, // Customize the ribbon text size
    // marginBottom: 5,
    // fontWeight: 'bold',
  },
  price: {
    position: 'absolute',
    // top: 10, // Adjust the top position as per your requirement
    right: 10, // Adjust the left position as per your requirement
    paddingHorizontal: 10,
    paddingVertical: 5,
    // transform: [{ rotate: '45deg' }],
  },
  priceText: {
    color: 'white', // Customize the ribbon text color
    fontSize: 14, // Customize the ribbon text size
    fontWeight: 'bold',
  },
})
