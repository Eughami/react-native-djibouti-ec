import CustomButton from '@components/CustomButton'
import Loader from '@components/Loader'
import { API_BASE_URL } from '@constants/api'
import { ImageZoom } from '@likashefqet/react-native-image-zoom'
import { useRoute, useTheme } from '@react-navigation/native'
import { getProduct } from '@services/home'
import { ResizeMode, Video } from 'expo-av'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
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
import { COLORS } from '@constants/style'
import { formatDate } from '@constants/common'

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
    onSuccess: (data) => adview([data.id]),
  })
  const loading = isFetching || isLoading
  if (loading) return <Loader />
  return (
    <>
      <ScrollView style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: COLORS[dark ? 'dark' : 'light'].dominantShade1 },
          ]}
        >
          {ad.title}
        </Text>
        {!ad?.attachment?.length ? (
          <View
            style={{
              width: width - 20,
              height: height * 0.5,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
              source={require('@assets/default.jpg')}
            />
          </View>
        ) : (
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
                      width: '100%',
                      height: '100%',
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
        )}

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

        <Text style={[styles.description, { color: colors.text }]}>
          {ad.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.priceText,
              { color: COLORS[dark ? 'dark' : 'light'].dominantShade1 },
            ]}
          >
            {parseInt(ad.price).toLocaleString('en-US')} FDJ
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(ad.createdAt)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='eye' size={12} color={colors.text} />
              <Text style={[styles.viewsText, { color: colors.text }]}>
                {parseInt(ad.count).toLocaleString('en-US')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          height: 40,
          flexDirection: 'row',
          position: 'absolute',
          bottom: 5,
        }}
      >
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
    marginBottom: 40,
  },
  title: {
    paddingVertical: 10,
    fontSize: 24,
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
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 30,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
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
