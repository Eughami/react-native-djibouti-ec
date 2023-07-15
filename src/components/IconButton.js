import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

function IconButton({ icon, size, color, onPress, text, nopad = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.buttonContainer, nopad && { paddingBottom: 0 }]}>
        <Ionicons name={icon} size={size} color={color} />
        {text && (
          <Text
            style={{
              color: color,
              marginLeft: 5,
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
})
