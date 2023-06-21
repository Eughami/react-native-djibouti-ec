import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@constants/style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// TODO make all colors theme specific
function BaseAd({ imageUrl }) {
  const navigation = useNavigation();

  // TODO make the height of one item fixed
  return (
    <View
      style={{
        margin: 20,
        height: 250,
        // if light mode else no background
        // backgroundColor: COLORS.primary.colorLight,
        borderColor: 'white',
        borderWidth: 1,
      }}
    >
      <Pressable onPress={() => navigation.navigate('Home.Categories')}>
        <View style={styles.container}>
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.image}
          />
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}> Premium </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>500000</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Catchy Ad TitleCatchy Ad TitleCatchy Ad TitleCatchy Ad Title
          </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Ionicons name="eye-outline" size={10} color="white" />
            <Text style={styles.descriptionText}>
              18781 views, 548 this week, 103 today
            </Text>
          </View>
          <Text style={styles.descriptionText}>25 Feb 2023</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default BaseAd;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: 350,
    height: 200,
    // aspectRatio: 0.8,
    resizeMode: 'cover',
  },
  ribbon: {
    position: 'absolute',
    top: 10, // Adjust the top position as per your requirement
    left: -25, // Adjust the left position as per your requirement
    backgroundColor: COLORS.primary.color, // Customize the ribbon background color
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-45deg' }],
  },
  ribbonText: {
    color: 'white', // Customize the ribbon text color
    fontSize: 12,
    paddingHorizontal: 10, // Customize the ribbon text size
    // marginBottom: 5,
    // fontWeight: 'bold',
  },
  price: {
    position: 'absolute',
    // top: 10, // Adjust the top position as per your requirement
    right: 10, // Adjust the left position as per your requirement
    backgroundColor: COLORS.primary.color, // Customize the ribbon background color
    paddingHorizontal: 10,
    paddingVertical: 5,
    // transform: [{ rotate: '45deg' }],
  },
  priceText: {
    color: 'white', // Customize the ribbon text color
    fontSize: 14, // Customize the ribbon text size
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green',
    marginBottom: 5,
  },
  titleText: {
    color: COLORS.primary.color,
    fontSize: 16,
  },
  descriptionContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  descriptionText: {
    color: 'white',
    fontSize: 10,
  },
});
