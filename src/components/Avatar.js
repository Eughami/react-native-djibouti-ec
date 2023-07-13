import { useNavigation, useTheme } from '@react-navigation/native'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ROUTES } from '@constants/routes'
import { COLORS } from '@constants/style'

function Avatar({ icon, title, category }) {
  const { dark, colors } = useTheme()
  const { navigate } = useNavigation()
  return (
    <View
      style={{
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          marginVertical: 10,

          backgroundColor: COLORS[dark ? 'dark' : 'light'].secondary,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name={icon}
          size={35}
          color='white'
          onPress={() =>
            navigate(`${ROUTES.HOME_CATEGORY}.${category}`, { category })
          }
        />
      </View>
      <Text
        style={{
          color: colors.text,
          textAlign: 'center',
          width: 80,
        }}
      >
        {title}
      </Text>
    </View>
  )
}

export default Avatar
