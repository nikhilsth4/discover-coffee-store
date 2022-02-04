import { createApi } from "unsplash-js"

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
})

const getCoffeeStoresPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  })

  const unsplashResults = photos.response.results
  const photosResponse = unsplashResults.map((result) => result.urls["small"])
  return photosResponse
}

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`
}

export const fetchCoffeeStores = async (
  latLong = "27.711387523885033,85.32441553410787",
  limit = 7
) => {
  const photos = await getCoffeeStoresPhotos()
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee stores", limit),
    {
      headers: {
        Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY}`,
      },
    }
  )
  const data = await response.json()
  return data.results.map((venue, i) => {
    return {
      id: venue.fsq_id,
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood:
        venue.location.neighborhood || venue.location.crossStreet || "",
      imgUrl: photos[i],
    }
  })
}
