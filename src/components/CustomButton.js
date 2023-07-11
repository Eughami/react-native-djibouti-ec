import { COLORS } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

function CustomButton({
  text,
  icon = null,
  isSelected,
  onPress,
  width = '45%',
  bg = null,
  color = null,
}) {
  const { dark, colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dateButton,
        {
          width,
          backgroundColor: bg ?? colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        },
        isSelected && {
          backgroundColor: bg ?? COLORS[dark ? 'dark' : 'light'].dominant,
          borderWidth: 0,
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      {icon && (
        <Ionicons
          style={styles.icon}
          size={20}
          color={color ?? colors.text}
          name={icon}
        />
      )}
      <Text
        style={[
          { color: color ?? colors.text, fontWeight: 'bold' },
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
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
})
export default CustomButton
