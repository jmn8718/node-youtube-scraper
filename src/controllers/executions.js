const { getDB } = require('../db');

const saveExecution = async function (executionId = '', results = []) {
  if (results.length === 0) {
    // simulate mongo result
    return { result: { ok: 1, n: 0 } };
  }
  const db = await getDB();

  const bulkResults = await db.collection('executions').bulkWrite(
    results.map(({ _id, channelId, videos = [], error = false }) => {
      return {
        insertOne: {
          document: {
            executionId,
            channelId,
            videos,
            channelDocumentId: _id,
            error,
            timestamp: Date.now()
          }
        }
      };
    })
  );

  return bulkResults;
};

module.exports = {
  saveExecution
};
