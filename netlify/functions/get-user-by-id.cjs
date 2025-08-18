/* eslint-env node */
const Airtable = require('airtable');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const tableName = process.env.AIRTABLE_TABLE_NAME;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId } = event.queryStringParameters;

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'userId is required' }) };
    }

    const record = await airtable(tableName).find(userId);
    const userData = {
      id: record.id,
      ...record.fields
    };

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
