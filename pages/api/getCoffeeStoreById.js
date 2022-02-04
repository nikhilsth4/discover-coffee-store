import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable"

const getCoffeeStoresById = async (req, res) => {
  try {
    const { id } = req.query
    if (id) {
      const records = await findRecordByFilter(id)
      if (records.length !== 0) {
        res.json(records)
      } else {
        res.json({ message: "id is missing" })
      }
    } else {
      res.status(400)
      res.json({ message: "id is missing" })
    }
  } catch (err) {
    console.error({ error: err })
    res.status(500)
    res.json({ message: "Something wrong", err })
  }
}

export default getCoffeeStoresById
