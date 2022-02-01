import { getMinifiedRecords, table } from "../../lib/airtable"

const createCoffeeStore = async (req, res) => {
  const { id, name, neighbourhood, address, imgUrl, voting } = req.body
  if (req.method === "POST") {
    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage()

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords)
          res.json(records)
        } else {
          if (name) {
            const createRecords = await table.create({
              fields: {
                id,
                name,
                address,
                neighbourhood,
                voting,
                imgUrl,
              },
            })
            const records = getMinifiedRecords(createRecords)

            res.json(records)
          } else {
            res.status(400)
            res.json({ message: "name or id is missing" })
          }
        }
      } else {
        res.status(400)
        res.json({ message: "id is missing" })
      }
    } catch (err) {
      console.error({ err })
      res.status(500)
      res.json({ message: "error creating or finding stores", err })
    }
  }
}

export default createCoffeeStore
