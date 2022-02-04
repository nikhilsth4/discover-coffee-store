import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable"

const favouriteCoffeeStoreById = async (req, res) => {
  const { id } = req.body
  if (req.method === "PUT") {
    try {
      if (id) {
        const records = await findRecordByFilter(id)
        if (records.length !== 0) {
          const record = records[0]

          const calculateVoting = parseInt(record.voting) + parseInt(1)

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ])

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord)
            res.json(minifiedRecords)
          }

          res.json(records)
        } else {
          res.json({ message: "error finding store" })
        }
      }
    } catch (error) {
      console.error({ error })
      res.status(500)
      res.json({ message: "error finding stores", error })
    }
  }
}

export default favouriteCoffeeStoreById
