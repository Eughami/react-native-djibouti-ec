import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'

function SelectedOption({ isSelected = false, toggleFunc, text }) {
  const { colors } = useTheme()
  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: '100%',
          flexDirection: 'row',
          borderColor: colors.text,
          // borderWidth: 1,
          height: 25,
          alignItems: 'center',
          margin: 5,
        },
        pressed && { opacity: 0.5 },
      ]}
      onPress={toggleFunc}
    >
      <Ionicons
        style={{
          marginHorizontal: 10,
        }}
        color={colors.text}
        size={20}
        name={`radio-button-o${isSelected ? 'n' : 'ff'}-outline`}
      />
      <Text
        style={{
          color: colors.text,
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}

export default SelectedOption
