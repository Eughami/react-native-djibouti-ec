import { useTheme } from '@react-navigation/native'
import { StyleSheet, Text } from 'react-native'

function FormLabel({ label, marginLeft }) {
  const { colors } = useTheme()
  return (
    <Text style={[styles.label, { color: colors.text, marginLeft }]}>
      {label}
    </Text>
  )
}

export default FormLabel
const styles = StyleSheet.create({
  label: {
    color: 'white',
    marginTop: 15,
    marginBottom: 10,
    // fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 0,
  },
})
