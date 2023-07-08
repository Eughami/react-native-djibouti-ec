import { COLORS } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { Pressable, StyleSheet, Text } from 'react-native'

function CustomButton({ text, isSelected, onPress, width = '45%' }) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dateButton,
        {
          width,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        },
        isSelected && { backgroundColor: '#FFD700', borderWidth: 0 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          { color: colors.text, fontWeight: 'bold' },
          isSelected && { color: 'white' },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  dateButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
})
export default CustomButton
