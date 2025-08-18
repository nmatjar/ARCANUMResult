/* eslint-env node */
const Airtable = require('airtable');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const tableName = process.env.AIRTABLE_TABLE_NAME;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, tokensToDeduct } = JSON.parse(event.body);

    if (!userId || !tokensToDeduct) {
      return { statusCode: 400, body: JSON.stringify({ error: 'userId and tokensToDeduct are required' }) };
    }

    const record = await airtable(tableName).find(userId);
    const currentTokens = record.get('Tokens') || 0;

    if (currentTokens < tokensToDeduct) {
      return { statusCode: 200, body: JSON.stringify({ success: false, newBalance: currentTokens, message: 'Niewystarczająca liczba tokenów' }) };
    }

    const newBalance = currentTokens - tokensToDeduct;
    await airtable(tableName).update(userId, { 'Tokens': newBalance });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, newBalance }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
