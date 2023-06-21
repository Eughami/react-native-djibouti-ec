import BaseView from '@components/BaseView'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useStore } from '@zustand/store'
import { Button, Text } from 'react-native'

function MyAds() {
  const colors = useTheme().colors
  const removeAllBears = useStore((state) => state.removeAllBears)
  const navigation = useNavigation()

  return (
    <BaseView>
      <Text style={{ color: colors.text }}>Add </Text>
      <Button title='nav' onPress={() => navigation.navigate('Product')} />
      <Button title='Increase' onPress={removeAllBears} />
    </BaseView>
  )
}

export default MyAds
