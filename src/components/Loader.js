import { COLORS } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'

function Loader() {
  const { dark } = useTheme()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator
        size={'large'}
        color={COLORS[dark ? 'dark' : 'light'].dominantShade2}
      />
    </View>
  )
}

export default Loader
