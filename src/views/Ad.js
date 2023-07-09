import CustomButton from '@components/CustomButton'
import Loader from '@components/Loader'
import { API_BASE_URL } from '@constants/api'
import { ImageZoom } from '@likashefqet/react-native-image-zoom'
import { useRoute, useTheme } from '@react-navigation/native'
import { getProduct } from '@services/home'
import { ResizeMode, Video } from 'expo-av'
import { useRef, useState } from 'react'
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useQuery } from 'react-query'
import { Ionicons } from '@expo/vector-icons'
import { adview } from '@services/log'

function Ad() {
  const { dark, colors } = useTheme()
  const { params } = useRoute()

  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height

  const carouselRef = useRef(null)
  const video = useRef(null)

  const [index, setIndex] = useState(0)

  // TODO. Add a view with device details (on mount ??????--on scroll--?????)

  const {
    isLoading,
    isFetching,
    data: ad,
  } = useQuery(`ads-${params?.id}`, () => getProduct(params?.id), {
    onSuccess: (data) => adview(data.id),
  })
  const loading = isFetching || isLoading
  if (loading) return <Loader />
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{ad.title}</Text>
        <Carousel
          ref={carouselRef}
          width={width - 20}
          height={height * 0.5}
          data={ad.attachment}
          enabled={ad?.attachment?.length > 1}
          scrollAnimationDuration={800}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onScrollEnd={(i) => setIndex(i)}
          renderItem={({ index }) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              {ad.attachment[index].path.startsWith('images') ? (
                <ImageZoom
                  uri={`${API_BASE_URL}/files/${ad.attachment[index].path}`}
                  loadingIndicatorSource={<Loader />}
                />
              ) : (
                <Video
                  ref={video}
                  // isMuted
                  style={{
                    margin: 10,
                    width: '100%',
                    height: '100%',
                    // borderColor: colors.border,
                    // borderWidth: 1,
                  }}
                  source={{
                    uri: `${API_BASE_URL}/files/${ad.attachment[index].path}`,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                />
              )}
            </View>
          )}
        />
        <View style={styles.pagination}>
          {ad?.attachment?.length > 1 && (
            <>
              {[...new Array(ad.attachment.length)].map((c, i) => (
                <View
                  key={i}
                  style={{
                    height: index === i ? 10 : 5,
                    width: index === i ? 10 : 5,
                    backgroundColor: colors.text,
                    marginHorizontal: 5,
                    borderRadius: 20,
                  }}
                />
              ))}
            </>
          )}
        </View>

        <Text style={styles.description}>{ad.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {parseInt(ad.price).toLocaleString('en-US')} FDJ
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.dateText}>02 Fevrier 2023</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='eye' size={12} />
              <Text style={styles.viewsText}>
                {parseInt(ad.count).toLocaleString('en-US')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0 }}>
        <CustomButton
          width={'50%'}
          text='CALL'
          icon='call-outline'
          bg='#2270af'
          color='white'
          onPress={() => Linking.openURL(`tel:+253${ad.phone}`)}
        />
        <CustomButton
          width={'50%'}
          text='WHASAPP'
          icon='logo-whatsapp'
          bg='green'
          color='white'
          onPress={() =>
            Linking.openURL(
              `whatsapp://send?text=Hello i'm interested in your ad&phone=253${ad.phone}`,
            )
          }
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderColor: 'red',
    // borderWidth: 1,
  },
  title: {
    paddingVertical: 10,
    fontSize: 24,
    color: 'orange',
  },
  pagination: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {},
  priceContainer: {
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 10,
    marginRight: 5,
  },
  viewsText: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 10,
  },
})
export default Ad
