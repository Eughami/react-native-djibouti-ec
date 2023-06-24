import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

function BaseView({ children }) {
  const colors = useTheme().colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

export default BaseView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
