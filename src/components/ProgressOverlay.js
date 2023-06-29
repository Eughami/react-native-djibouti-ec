import { extractRgbComponents } from '@constants/style'
import { useTheme } from '@react-navigation/native'
import { Modal, Text, View, useWindowDimensions } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'

function Progressoverlay({ visible, progress, title }) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()

  const { blue, green, red } = extractRgbComponents(colors.card)
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
          backgroundColor: `rgba(${red},${green},${blue},0.8)`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressBar
          color={colors.primary}
          progress={progress}
          width={parseInt(width * 0.8)}
          height={10}
        />
        <Text style={{ marginVertical: 10, color: colors.primary }}>
          {title}
        </Text>
      </View>
    </Modal>
  )
}

export default Progressoverlay
