import BaseView from '@components/BaseView';
import { useTheme } from '@react-navigation/native';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Preview from '@components/Preview';

function Title({ text }) {
  const { colors } = useTheme();
  return (
    <View style={{ margin: 20 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          paddingLeft: 10,
          fontWeight: 'bold',
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function Avatar({ icon }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          marginHorizontal: 20,
          marginVertical: 10,
          backgroundColor: 'brown',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name={icon}
          size={35}
          color="white"
          // onPress={() => console.log('Navigate to that category')}
        />
      </View>
      <Text
        style={{
          color: colors.text,
          textAlign: 'center',
          width: 80,
        }}
      >
        small title
      </Text>
    </View>
  );
}

function TopCategories() {
  // TODO. remove this flatlist and make it  a fixed 6  items
  return (
    <View>
      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
        }}
        data={[
          'musical-notes-outline',
          'car-outline',
          'home-outline',
          'briefcase-outline',
          'key-outline',
          'laptop-outline',
        ]}
        renderItem={(itemData) => <Avatar icon={itemData.item} />}
        keyExtractor={(item) => item}
        numColumns={3}
      />
    </View>
  );
}

function Search() {
  return (
    <ScrollView>
      <Title text="Top Categories" />
      <TopCategories />
      <Title text="Latest Ads" />
      {[
        {
          key: 1,
          title: 'First Product title',
          imageUrl:
            'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
        },
        {
          key: 2,
          title: 'Second Product title',
          imageUrl:
            'https://ik.imagekit.io/dahaboo/tr:w-325/upload/i/2023-06/voiture-toyota-highlander-annee-2017-xle-awd-r3j-192912.jpg',
        },
        {
          key: 3,
          title: 'Third Product title',
          imageUrl:
            'https://media.istockphoto.com/id/1146517111/photo/taj-mahal-mausoleum-in-agra.jpg?s=612x612&w=0&k=20&c=vcIjhwUrNyjoKbGbAQ5sOcEzDUgOfCsm9ySmJ8gNeRk=',
        },
        {
          key: 4,
          title: 'Fourth Product title',
          imageUrl:
            'https://imgd.aeplcdn.com/1056x594/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg',
        },
        {
          key: 5,
          title: 'Fifth Product title',
          imageUrl:
            'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
        },
      ].map((item) => (
        <Preview {...item} />
      ))}
    </ScrollView>
  );
}

export default Search;
