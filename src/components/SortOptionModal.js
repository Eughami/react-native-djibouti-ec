import { sortOptions } from '@constants/common'
import { useTheme } from '@react-navigation/native'
import { Modal, Pressable, Text, View } from 'react-native'
import SelectedOption from './SelectedOption'
import { useStore } from '@zustand/store'
import translate from '@lang/translate'

function SortOptionsModal({
  isOpen,
  toggleFunc,
  currentSelection,
  handleSelection,
}) {
  const { colors, dark } = useTheme()
  const lang = useStore((state) => state.lang)
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
            {translate('sort.title', lang)}
          </Text>
          {sortOptions.map((option) => (
            <SelectedOption
              text={translate(`sort.${option.label}`, lang)}
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
