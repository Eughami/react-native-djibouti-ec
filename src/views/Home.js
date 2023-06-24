import Preview from '@components/Preview'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useStore } from '@zustand/store'
import { useEffect } from 'react'
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native'

const Home = () => {
  const colors = useTheme().colors
  const bears = useStore((state) => state.bears)
  const { width, height } = useWindowDimensions()
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setParams({ headerTitle: 'Home' }) // Update the header title
  }, [])

  // INFO. with > 500 is considered tablet for me
  // when on the homepage/category/search show a list of 2 items instead of 1
  console.log({ height, width })

  function renderItem(itemData) {
    // return <BaseAd imageUrl={itemData.item.imageUrl} />
    return <Preview {...itemData.item} />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <FlatList
        data={[
          {
            id: 1,
            title: 'First Product title',
            imageUrl:
              'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
          },
          {
            id: 2,
            title: 'Second Product title',
            imageUrl:
              'https://ik.imagekit.io/dahaboo/tr:w-325/upload/i/2023-06/voiture-toyota-highlander-annee-2017-xle-awd-r3j-192912.jpg',
          },
          {
            id: 3,
            title: 'Third Product title',
            imageUrl:
              'https://media.istockphoto.com/id/1146517111/photo/taj-mahal-mausoleum-in-agra.jpg?s=612x612&w=0&k=20&c=vcIjhwUrNyjoKbGbAQ5sOcEzDUgOfCsm9ySmJ8gNeRk=',
          },
          {
            id: 4,
            title: 'Fourth Product title',
            imageUrl:
              'https://imgd.aeplcdn.com/1056x594/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg',
          },
          {
            id: 5,
            title: 'Fifth Product title',
            imageUrl:
              'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
          },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        // numColumns={2}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
