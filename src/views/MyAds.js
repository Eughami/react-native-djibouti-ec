import Loader from '@components/Loader'
import { ImageZoom } from '@likashefqet/react-native-image-zoom'
import { ResizeMode, Video } from 'expo-av'
import * as React from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

function Index() {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const video = React.useRef(null)
  const carouselRef = React.useRef(null)
  const [index, setIndex] = React.useState(0)

  // const [status, setStatus] = React.useState({})

  const handleScrollEnd = (index) => {
    setIndex(index)
    // console.log(index)
    // // Check if the scroll position has reached the end
    // if (index === 2 - 1) {
    //   // Prevent the scroll from resting at the first position
    //   const scrollPosition = { x: (2 - 1) * width, y: 0 }
    //   carouselRef.current.scrollTo(1)
    // }
  }

  React.useEffect(() => {
    const ii = carouselRef.current.getCurrentIndex()
    setIndex(ii)
    console.log('reff ', ii)
    carouselRef.current.prev = () => {}
    carouselRef.current.next = () => {}
  }, [carouselRef.current])

  console.log('outside index : ', index)

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Carousel
        ref={carouselRef}
        // pagingEnabled={true}
        // onScrollBegin={}
        // loop
        width={width}
        height={height * 0.6}
        // autoPlay={true}
        data={[...new Array(2).keys()]}
        scrollAnimationDuration={500}
        onScrollBegin={() => {
          carouselRef.current.prev = () => {}
          carouselRef.current.next = () => {}
        }}
        style={{
          borderWidth: 1,
          borderColor: 'red',
        }}
        // mode='parallax'
        onScrollEnd={handleScrollEnd}
        // onSnapToItem={(index) => setIndex(index)}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {index === 0 ? (
              <ImageZoom
                uri='https://dahabo-api.eughami.com/api/v1/files/images/Car/d3dcc536-aefb-4add-a5c5-99920957fac3.jpeg'
                loadingIndicatorSource={<Loader />}
              />
            ) : (
              <Video
                ref={video}
                isMuted
                style={{
                  margin: 10,
                  width: '95%',
                  height: '95%',
                  // borderColor: colors.border,
                  // borderWidth: 1,
                }}
                source={{
                  uri: 'https://dahabo-api.eughami.com/api/v1/files/videos/Game/63ae61c1-87d1-4583-b484-31efc04b871b.mp4',
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                // isLooping
                // shouldPlay
                // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
            )}
          </View>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {console.log('reder index : ', index)}
        <View
          style={{
            height: index === 0 ? 10 : 5,
            width: index === 0 ? 10 : 5,
            backgroundColor: 'black',
            marginHorizontal: 5,
            borderRadius: 20,
          }}
        ></View>
        <View
          style={{
            height: index === 1 ? 10 : 5,
            width: index === 1 ? 10 : 5,
            backgroundColor: 'black',
            marginHorizontal: 5,
            borderRadius: 20,
          }}
        ></View>
      </View>
    </View>
  )
}

export default Index
