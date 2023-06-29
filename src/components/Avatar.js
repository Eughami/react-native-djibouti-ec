import { useNavigation, useTheme } from '@react-navigation/native'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ROUTES } from '@constants/routes'

function Avatar({ icon, title }) {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          marginVertical: 10,

          backgroundColor: 'brown',
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
            navigate(`${ROUTES.HOME_CATEGORY}.${title}`, { category: title })
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
