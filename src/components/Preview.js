import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'
import { useNavigation } from '@react-navigation/native'
import * as React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  useColorScheme,
} from 'react-native'

function Preview(props) {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const { imageUrl, title } = props

  return (
    <View style={styles.root}>
      <View style={[styles.container, styles[colorScheme]]}>
        <Pressable
          onPress={() => {
            navigation.navigate(ROUTES.HOME_PRODUCT)
          }}
        >
          <Image style={styles.image} source={{ uri: imageUrl }} />
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}> Premium </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>500,000 FDJ</Text>
          </View>

          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.text}>
              {title}
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
    backgroundColor: COLORS.primary.color, // Customize the ribbon background color
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
    backgroundColor: '#ff9009', // Customize the ribbon background color
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
