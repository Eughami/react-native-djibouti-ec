import { COLORS } from '@constants/style'
import { ActivityIndicator, View } from 'react-native'

function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size={'large'} color={COLORS.primary.color} />
    </View>
  )
}

export default Loader
