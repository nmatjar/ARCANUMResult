import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Airtable with API key
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const usersTable = process.env.AIRTABLE_USERS_TABLE || 'Users';

// Check if Airtable is properly configured
const isAirtableConfigured = () => {
  if (!apiKey || !baseId) {
    console.warn('Airtable API key or base ID not configured.');
    return false;
  }
  return true;
};

// Initialize Airtable base if configured
let base;
if (isAirtableConfigured()) {
  Airtable.configure({ apiKey });
  base = Airtable.base(baseId);
} else {
  console.warn('Using mock Airtable service because configuration is missing.');
}

/**
 * Get user record from Airtable
 * @param {string} userId - User ID to look up
 * @returns {Promise<object>} - User record or null
 */
export const getUserRecord = async (userId) => {
  if (!isAirtableConfigured()) {
    console.log('MOCK: Getting user record for', userId);
    // Return mock data for testing
    return { 
      id: userId, 
      tokenBalance: 500,
      mock: true
    };
  }

  try {
    // Look up user by ID in Airtable
    const records = await base(usersTable)
      .select({
        filterByFormula: `{userId} = "${userId}"`,
        maxRecords: 1
      })
      .firstPage();

    if (records && records.length > 0) {
      const record = records[0];
      return {
        id: record.id,
        ...record.fields,
        tokenBalance: record.fields.tokenBalance || 0
      };
    }
    
    console.warn(`User ${userId} not found in Airtable`);
    return null;
  } catch (error) {
    console.error('Error getting user record from Airtable:', error);
    throw error;
  }
};

/**
 * Update user's token balance
 * @param {string} userId - User ID
 * @param {number} newBalance - New token balance
 * @returns {Promise<object>} - Updated user record
 */
export const updateTokenBalance = async (userId, newBalance) => {
  if (!isAirtableConfigured()) {
    console.log(`MOCK: Updated token balance for ${userId} to ${newBalance}`);
    // Return mock data for testing
    return { 
      id: userId, 
      tokenBalance: newBalance,
      mock: true
    };
  }

  try {
    // Get the user's record first
    const user = await getUserRecord(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    // Update the record in Airtable
    const updatedRecords = await base(usersTable).update([
      {
        id: user.id,
        fields: {
          tokenBalance: newBalance
        }
      }
    ]);
    
    if (updatedRecords && updatedRecords.length > 0) {
      return {
        id: updatedRecords[0].id,
        ...updatedRecords[0].fields
      };
    }
    
    throw new Error('Failed to update token balance');
  } catch (error) {
    console.error('Error updating token balance in Airtable:', error);
    throw error;
  }
};

/**
 * Add tokens to user's balance
 * @param {string} userId - User ID
 * @param {number} amount - Amount of tokens to add
 * @returns {Promise<object>} - Updated user record
 */
export const addTokens = async (userId, amount) => {
  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid parameters: userId and a positive amount are required');
  }
  
  try {
    // Get current user record and token balance
    const user = await getUserRecord(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    // Calculate new balance
    const currentBalance = user.tokenBalance || 0;
    const newBalance = currentBalance + amount;
    
    // Update the balance
    return await updateTokenBalance(userId, newBalance);
  } catch (error) {
    console.error(`Error adding ${amount} tokens to user ${userId}:`, error);
    throw error;
  }
};

/**
 * Deduct tokens from user's balance
 * @param {string} userId - User ID
 * @param {number} amount - Amount of tokens to deduct
 * @returns {Promise<object>} - Updated user record
 */
export const deductTokens = async (userId, amount) => {
  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid parameters: userId and a positive amount are required');
  }
  
  try {
    // Get current user record and token balance
    const user = await getUserRecord(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    // Calculate new balance
    const currentBalance = user.tokenBalance || 0;
    
    // Check if user has enough tokens
    if (currentBalance < amount) {
      throw new Error(`Insufficient token balance. Required: ${amount}, Available: ${currentBalance}`);
    }
    
    const newBalance = currentBalance - amount;
    
    // Update the balance
    return await updateTokenBalance(userId, newBalance);
  } catch (error) {
    console.error(`Error deducting ${amount} tokens from user ${userId}:`, error);
    throw error;
  }
};

/**
 * Check if user has enough tokens
 * @param {string} userId - User ID
 * @param {number} requiredAmount - Amount of tokens needed
 * @returns {Promise<boolean>} - Whether user has enough tokens
 */
export const hasEnoughTokens = async (userId, requiredAmount) => {
  try {
    const user = await getUserRecord(userId);
    
    if (!user) {
      return false;
    }
    
    return (user.tokenBalance || 0) >= requiredAmount;
  } catch (error) {
    console.error('Error checking token balance:', error);
    return false;
  }
};

export default {
  getUserRecord,
  updateTokenBalance,
  addTokens,
  deductTokens,
  hasEnoughTokens
};