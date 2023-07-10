import IconButton from '@components/IconButton'
import Loader from '@components/Loader'
import Preview from '@components/Preview'
import SelectedOption from '@components/SelectedOption'
import SortOptionsModal from '@components/SortOptionModal'
import { CategoryEnum } from '@constants/categories'
import { sortOptions } from '@constants/common'
import { extractRgbComponents } from '@constants/style'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { adsPerCategory } from '@services/category'
import { updateFav } from '@services/home'
import { adview } from '@services/log'
import { useStore } from '@zustand/store'
import { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  LayoutAnimation,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query'

function Category() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [sort, setSort] = useState(sortOptions[0])
  const { name, params } = useRoute()
  const { colors, dark } = useTheme()
  const [isFav, setIsFav] = useState(false)
  const navigation = useNavigation()
  const favCat = useStore((state) => state.favCat)
  const debounceTimeoutRef = useRef(null)
  const flatListRef = useRef(null)
  const viewDurationRef = useRef(null)
  const viewPerAd = useRef([])

  const { blue, green, red } = extractRgbComponents(
    dark ? colors.border : colors.background,
  )
  const {
    isLoading,
    isFetching,
    data: ads,
    refetch,
  } = useQuery(
    `${name}-ads`,
    () => adsPerCategory(page, params?.category, sort.value),
    {
      onSuccess: (data) => {
        setHasMore(page < data?.pageCount)
        setList((list) => [...list, ...data.data])
      },
    },
  )

  const { mutate: favMutation, isLoading: mutationLoading } = useMutation(
    updateFav,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('fav-cat')
      },
    },
  )

  const handleToggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setSort(option)
    setIsOpen(false)
  }

  useEffect(() => {
    const found = favCat?.find((c) => c.name === params?.category)
    setIsFav(!!found)

    return () => {
      // Save the views here
      adview(viewPerAd.current)
    }
  }, [favCat])

  useEffect(() => {
    setList([])
    if (page !== 1) {
      setPage(1)
    } else {
      refetch()
    }
  }, [sort])

  useEffect(() => {
    refetch()
  }, [page])

  const debounceFavAction = () => {
    if (mutationLoading) {
      return // Ignore button press if a request is already pending
    }

    // Clear the previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set a new timeout of 1 second
    debounceTimeoutRef.current = setTimeout(() => {
      favMutation(params.category)
    }, 3000)
    setIsFav(!isFav)
  }

  const loading = isFetching || isLoading

  const handleEndReached = () => {
    if (hasMore) {
      setPage(page + 1)
    }
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return

    if (!viewDurationRef.current) {
      viewDurationRef.current = performance.now()
      return
    }

    // here calculate time since last change
    const changeDuration = performance.now() - viewDurationRef.current
    // reset the timer
    viewDurationRef.current = performance.now()
    if (changeDuration < 3000) return

    const middleItems = viewableItems.slice(1, -1)
    const keys = middleItems.map((c) => c.key)
    viewPerAd.current = [...new Set([...viewPerAd.current, ...keys])]
  }).current

  const Headercom = () => (
    <View style={styles.sortContainer}>
      {Object.keys(CategoryEnum).includes(params?.category) && (
        <IconButton
          icon={isFav ? 'notifications-outline' : 'notifications-off-outline'}
          color={colors.text}
          size={30}
          onPress={debounceFavAction}
        />
      )}
      <View
        style={{
          backgroundColor: `rgba(${red},${green},${blue},1)`,
          borderRadius: 20,
          borderColor: colors.border,
          // borderWidth: 1,
          padding: 2,
        }}
      >
        <IconButton
          icon='swap-vertical-outline'
          color={colors.text}
          size={20}
          onPress={handleToggleDropdown}
          text={sort.label || 'Sort'}
        />
      </View>
    </View>
  )
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {page === 1 && loading ? (
          <Loader />
        ) : (
          <FlatList
            ref={flatListRef}
            style={{ flex: 1, width: '100%' }}
            data={list}
            renderItem={(itemData) => <Preview {...itemData.item} />}
            keyExtractor={(item) => item.id}
            ListFooterComponent={hasMore || loading ? Loader : null}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={onViewableItemsChanged}
            ListHeaderComponent={Headercom}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text }}>No ads yet.</Text>
              </View>
            }
          />
        )}
      </View>
      <SortOptionsModal
        isOpen={isOpen}
        toggleFunc={() => setIsOpen(!isOpen)}
        currentSelection={sort}
        handleSelection={handleOptionSelect}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortContainer: {
    padding: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

export default Category
