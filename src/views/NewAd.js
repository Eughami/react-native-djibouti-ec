import BaseView from '@components/BaseView'
import { useTheme } from '@react-navigation/native'
import { useStore } from '@zustand/store'
import { Button, Text } from 'react-native'

function NewAd() {
  const colors = useTheme().colors
  const increasePopulation = useStore((state) => state.increasePopulation)
  const randomPopulation = useStore((state) => state.randomPopulation)
  return (
    <BaseView>
      <Text style={{ color: colors.text }}>Add </Text>
      <Button title='Increase' onPress={increasePopulation} />
      <Button
        title='random'
        onPress={() => randomPopulation(Math.floor(Math.random() * 100) + 1)}
      />
    </BaseView>
  )
}

export default NewAd
