import { COLORS, getLighterShade } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { Modal, Text, View, useWindowDimensions } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'

function Progressoverlay({ visible, progress, title }) {
  const { dark, colors } = useTheme()
  const { width } = useWindowDimensions()

  return (
    <Modal
      animationType='slide'
      transparent={true}
      statusBarTranslucent={true}
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: getLighterShade(colors.card, 0.7),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressBar
          color={COLORS[dark ? 'dark' : 'light'].dominant}
          progress={progress}
          width={parseInt(width * 0.8)}
          height={10}
        />
        <Text
          style={{
            marginVertical: 10,
            color: COLORS[dark ? 'dark' : 'light'].dominant,
          }}
        >
          {title}
        </Text>
      </View>
    </Modal>
  )
}

export default Progressoverlay
