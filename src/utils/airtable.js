import Airtable from 'airtable';

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

export const fetchTestData = async (testId) => {
  console.log(`[Airtable] Fetching test data for ID: ${testId}`);
  console.log('[Airtable] Configuration:', {
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
    accessToken: `${import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN?.slice(0, 5)}...${import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN?.slice(-5)}`,
    tableName: 'Tests'
  });

  try {
    console.log('[Airtable] Initiating API request...');
    const records = await base('Persons')
      .select({
        filterByFormula: `{Code} = '${testId}'`,
        maxRecords: 1
      })
      .firstPage();

    console.log(`[Airtable] Received ${records?.length || 0} records`);
    
    if (records && records.length > 0) {
      const inputString = records[0].fields.fullcode.replace(/"/g, '');
      console.log('[Airtable] Successfully retrieved test data');
      return inputString;
    }
    console.warn('[Airtable] No test found with the provided ID');
    throw new Error('Test not found');
  } catch (error) {
    console.error('[Airtable] Error fetching test data:', {
      error: error.message,
      errorType: error.constructor.name,
      statusCode: error.statusCode,
      testId,
      timestamp: new Date().toISOString(),
      accessTokenPresent: !!import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN,
      baseIdPresent: !!import.meta.env.VITE_AIRTABLE_BASE_ID
    });
    throw error;
  }
};