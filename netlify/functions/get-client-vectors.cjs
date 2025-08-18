/* eslint-env node */
const Airtable = require('airtable');

// Configure Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async (event) => {
  console.log('get-client-vectors function invoked.');

  if (event.httpMethod !== 'GET') {
    console.log('Invalid HTTP method:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { clientCode } = event.queryStringParameters;
    console.log('Received clientCode:', clientCode);

    if (!clientCode) {
      console.error('Error: clientCode is missing.');
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'clientCode is required' }) 
      };
    }

    // Check for environment variables
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    // Enhanced logging for verification purposes
    console.log('Airtable Env Vars Status:', {
      apiKey: apiKey ? `Loaded (ends with ...${apiKey.slice(-4)})` : 'MISSING',
      baseId: baseId ? `Loaded (${baseId})` : 'MISSING',
      tableName: tableName ? `Loaded (${tableName})` : 'MISSING',
    });

    if (!apiKey || !baseId || !tableName) {
      throw new Error('Airtable environment variables are not configured.');
    }

    // Fetch client data from Airtable
    console.log(`Fetching data from Airtable for clientCode: ${clientCode}`);
    const records = await airtable(tableName)
      .select({
        filterByFormula: `{Code} = '${clientCode}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      console.warn(`Client not found for code: ${clientCode}`);
      return { 
        statusCode: 404, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Client not found' }) 
      };
    }

    const clientData = records[0].fields;
    console.log('Successfully fetched client data:', clientData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    };
  } catch (error) {
    console.error('Error in get-client-vectors function:', error);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
