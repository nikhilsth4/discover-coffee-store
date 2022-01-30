import { fetchCoffeeStores } from "../../lib/coffee-stores"

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query
    const response = await fetchCoffeeStores(latLong, limit)
    res.status(200).json(response)
  } catch (err) {
    console.error({ error: err })
    res.status(500)
    res.json({ message: "Something wrong", err })
  }
}

export default getCoffeeStoresByLocation
