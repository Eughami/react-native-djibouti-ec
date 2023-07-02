import { sortOptions } from '@constants/common'
import { useTheme } from '@react-navigation/native'
import { Modal, Pressable, Text, View } from 'react-native'
import SelectedOption from './SelectedOption'

function SortOptionsModal({
  isOpen,
  toggleFunc,
  currentSelection,
  handleSelection,
}) {
  const { colors, dark } = useTheme()
  return (
    <Modal visible={isOpen} transparent={true} onRequestClose={toggleFunc}>
      <Pressable
        onPress={toggleFunc}
        style={{
          flex: 1,
          backgroundColor: dark ? 'rgba(1, 1, 1, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: dark ? colors.border : colors.card,
            padding: 16,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginVertical: 10,
            }}
          >
            Select which Ads you would like to see first
          </Text>
          {sortOptions.map((option) => (
            <SelectedOption
              text={option.label}
              key={option.value}
              toggleFunc={() => handleSelection(option)}
              isSelected={currentSelection?.value === option.value}
            />
          ))}
        </View>
      </Pressable>
    </Modal>
  )
}

export default SortOptionsModal
