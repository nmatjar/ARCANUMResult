import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import axios from 'axios';
import Stripe from 'stripe';
import airtableService from './services/airtableService.js';

dotenv.config();
console.log('Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 3001;
const IMAGINE_API_KEY = process.env.IMAGINE_API_KEY || 'imgn_placeholder_key_for_development';

// Initialize Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; 
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(STRIPE_SECRET_KEY);

console.log('Stripe initialized in', process.env.NODE_ENV || 'development', 'mode');

// Middleware
app.use(cors());

// Special handling for Stripe webhooks (needs raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Anthropic client
console.log('ANTHROPIC_API_KEY available:', !!process.env.VITE_LLM_API_KEY);
console.log('ANTHROPIC_API_KEY preview:', process.env.VITE_LLM_API_KEY ? process.env.VITE_LLM_API_KEY.substring(0, 10) + '...' : 'Not found');

const anthropic = new Anthropic({
  apiKey: process.env.VITE_LLM_API_KEY,
});

// Log middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Save original send method
  const originalSend = res.send;
  
  // Override send method
  res.send = function(body) {
    const duration = Date.now() - start;
    
    // Log request and response
    console.log('\n=== API REQUEST ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    
    if (req.body.prompt) {
      console.log('\n--- PROMPT ---');
      console.log(req.body.prompt);
      
      // Check if the prompt contains any unfilled template placeholders like {variable_name}
      const unreplacedVariables = (req.body.prompt.match(/{[a-zA-Z0-9_]+}/g) || []);
      if (unreplacedVariables.length > 0) {
        console.log('\n--- WARNING: UNFILLED TEMPLATE VARIABLES ---');
        console.log(unreplacedVariables);
      }
    }
    
    if (req.body.imagePrompt) {
      console.log('\n--- IMAGE PROMPT ---');
      console.log(req.body.imagePrompt);
    }
    
    if (req.body.systemPrompt) {
      console.log('\n--- SYSTEM PROMPT ---');
      console.log(req.body.systemPrompt);
    }
    
    if (typeof body === 'string') {
      let responseBody;
      try {
        responseBody = JSON.parse(body);
      } catch (e) {
        responseBody = body;
      }
      
      console.log('\n--- RESPONSE ---');
      if (responseBody.content) {
        console.log(`Content length: ${responseBody.content.length} characters`);
        console.log(`Content preview: ${responseBody.content.substring(0, 150)}...`);
      } else {
        console.log('No content in response or error occurred');
      }
    }
    
    console.log('===================\n');
    
    // Call original send
    return originalSend.call(this, body);
  };
  
  next();
});

// Removed Freepik search endpoint

// Imagine API - check image generation status
const checkImageStatus = async (taskId) => {
  if (!taskId) {
    console.error('No task ID provided for status check');
    return { status: 'error', error: 'No task ID provided' };
  }
  
  try {
    console.log(`Checking status for task: ${taskId}`);
    const response = await axios.get(`https://cl.imagineapi.dev/items/images/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${IMAGINE_API_KEY}`
      }
    });
    
    // Log the response without flooding the console
    const logData = response.data && response.data.data ? 
      { ...response.data, data: '...(truncated for logging)' } : 
      response.data;
      
    console.log('Status response:', logData);
    
    // If data is nested inside a data property, normalize it
    if (response.data && response.data.data) {
      // Assume the data.data contains all the important info
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error checking image status for task ${taskId}:`, error.message);
    return { status: 'error', error: error.message };
  }
};

// Wait for image generation to complete
const waitForImageCompletion = async (taskId, maxAttempts = 30) => {
  if (!taskId) {
    console.error('No task ID provided to waitForImageCompletion');
    throw new Error('No task ID provided for polling');
  }
  
  console.log(`Starting to poll for task ${taskId}, will check for ${maxAttempts} attempts`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await checkImageStatus(taskId);
    
    // Handle different status types from the API
    if (result.status === 'error') {
      console.error(`Error polling:`, result.error);
      if (attempt < 2) { 
        // For the first couple attempts, retry quickly in case it's just not available yet
        console.log('Retrying quickly...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
    }
    
    // Check various status fields that might be in the response
    const status = result.status || result.state || (result.data && result.data.status);
    
    if (!status) {
      console.log('No status field found in response, full response:', JSON.stringify(result, null, 2));
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    
    switch(status.toLowerCase()) {
      case 'completed':
      case 'done':
      case 'succeeded':
      case 'success':
        // Get the upscaled URLs array if available
        const upscaledUrls = result.upscaled_urls || 
                           (result.data && result.data.upscaled_urls) ||
                           (result.result && result.result.upscaled_urls);
                           
        // Get the main image URL as fallback
        const mainImageUrl = result.url || 
                          (result.data && result.data.url) || 
                          (result.result && result.result.url) ||
                          (result.output && result.output.url);
        
        // If we have upscaled URLs (multiple versions of the image)
        if (upscaledUrls && Array.isArray(upscaledUrls) && upscaledUrls.length > 0) {
          console.log(`Found ${upscaledUrls.length} upscaled images`);
          
          // Return all the upscaled images and the main one
          return { 
            url: mainImageUrl, // Main image URL
            upscaledUrls: upscaledUrls, // Array of upscaled variants
            imageCount: upscaledUrls.length,
            status: 'completed',
            id: taskId
          };
        } else if (mainImageUrl) {
          console.log('Image ready (no upscaled versions):', mainImageUrl);
          // Return a standardized object with just the main URL
          return { 
            url: mainImageUrl,
            upscaledUrls: [mainImageUrl], // Single image in array for consistent handling
            imageCount: 1,
            status: 'completed',
            id: taskId
          };
        } else {
          console.log('Status is success but no URL found');
          console.log('Full response:', JSON.stringify(result, null, 2));
        }
        break;
        
      case 'failed':
      case 'error':
      case 'failure':
        console.error('Generation failed:', result.error || 'Unknown error');
        return null;
        
      default:
        // For any other status (processing, pending, etc.)
        console.log(`Status: ${status} (attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
    }
  }
  
  throw new Error('Maximum wait time exceeded');
};

// Imagine API image generation route
app.post('/api/generate-image', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    // Initial request to start generation
    const response = await axios.post('https://cl.imagineapi.dev/items/images/', {
      prompt: req.body.prompt,
      parameters: {
        "--ar": "1:1" // Square format for better thumbnail display
      }
    }, {
      headers: {
        'Authorization': `Bearer ${IMAGINE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Full API Response:', JSON.stringify(response.data, null, 2));
    
    // The API returns the data inside a 'data' property
    if (!response.data || (!response.data.id && !response.data.data)) {
      console.log('Unexpected response format:', JSON.stringify(response.data, null, 2));
      throw new Error('No task ID found in API response');
    }
    
    // Extract the ID based on response format (direct or nested in data)
    let taskId;
    if (response.data.data && response.data.data.id) {
      taskId = response.data.data.id;
    } else {
      taskId = response.data.id;
    }
    
    console.log('Generation started, task ID:', taskId);
    
    // Wait for the image to be ready
    const finalResult = await waitForImageCompletion(taskId);
    
    if (finalResult) {
      console.log('Image generation completed successfully');
      res.json(finalResult);
    } else {
      throw new Error('Image generation failed');
    }
  } catch (error) {
    console.error('Error details:', error.response?.data || error);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Routes
app.post('/api/generate', async (req, res) => {
  const { prompt, systemPrompt = "", generateImage = false, imagePrompt = "", maxTokens = 1024, temperature = 0.7 } = req.body;
  
  try {
    console.log('Calling Anthropic API with prompt:', prompt.substring(0, 100) + '...');
    console.log('System prompt:', systemPrompt);
    console.log('Model:', 'claude-3-7-sonnet-20250219'); // Using Haiku which is faster and cheaper
    
    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // Using a different model that's more reliable
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    // Handle image generation if requested
    let imageUrl = null;
    let imageAttribution = null;
    if (generateImage && imagePrompt) {
      try {
        console.log('Image generation requested for prompt:', imagePrompt);
        
        console.log('Attempting to generate AI image with Imagine API...');
        const aiImageResponse = await axios.post(`http://localhost:${PORT}/api/generate-image`, {
          prompt: imagePrompt
        });
        
        // Handle the response which now includes upscaled versions
        if (aiImageResponse.data) {
          // Check if we have multiple images (upscaled versions)
          if (aiImageResponse.data.upscaledUrls && aiImageResponse.data.upscaledUrls.length > 0) {
            // Return all the generated images
            imageUrl = aiImageResponse.data.upscaledUrls;
            imageAttribution = `AI-generated images by ImagineAPI (${aiImageResponse.data.imageCount} variations)`;
            console.log(`Successfully generated ${aiImageResponse.data.imageCount} AI images`);
          } else if (aiImageResponse.data.url) {
            // Just a single image
            imageUrl = aiImageResponse.data.url;
            imageAttribution = "AI-generated image by ImagineAPI";
            console.log('Successfully generated AI image:', imageUrl);
          } else {
            console.log('No image URLs in response:', aiImageResponse.data);
            throw new Error('No AI images generated');
          }
        } else {
          console.log('Empty response data');
          throw new Error('Empty response from image generation API');
        }
      } catch (imageError) {
        console.error('Error generating image:', imageError);
        console.error('Error details:', imageError.message);
        if (imageError.response) {
          console.error('Response status:', imageError.response.status);
          console.error('Response data:', imageError.response.data);
        }
        
        // Use a placeholder image instead
        imageUrl = 'https://placehold.co/600x400/eee/31343C?text=Image+Generation+Failed';
        imageAttribution = 'Failed to generate image';
        console.log('Using placeholder image due to error');
      }
    }
    
    // Return response
    res.json({
      success: true,
      content: message.content[0].text,
      imageUrl: imageUrl,
      imageAttribution: imageAttribution
    });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Token management routes

// Get available energy packages
app.get('/api/token-packages', (req, res) => {
  try {
    // This should be moved to a database or config file in production
    const energyPackages = [
      { id: 'mini', name: 'Mini Energia', amount: 100, price: 4.99, description: 'Idealny do wypróbowania platformy' },
      { id: 'basic', name: 'Podstawowa Energia', amount: 500, price: 19.99, description: 'Świetna dla okazjonalnych użytkowników' },
      { id: 'standard', name: 'Standardowa Energia', amount: 1200, price: 39.99, description: 'Najpopularniejsza opcja' },
      { id: 'premium', name: 'Premium Energia', amount: 3000, price: 79.99, description: 'Najlepsza wartość dla aktywnych użytkowników' },
      { id: 'enterprise', name: 'Energia Biznesowa', amount: 10000, price: 199.99, description: 'Idealna dla intensywnego użytkowania' }
    ];

    res.json({
      success: true,
      packages: energyPackages
    });
  } catch (error) {
    console.error('Error retrieving token packages:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Deduct energy from user account
app.post('/api/deduct-tokens', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid parameters. userId and a positive amount are required.' 
      });
    }
    
    console.log(`Deducting ${amount} energy units from user ${userId}`);
    
    try {
      // Check if user has enough energy first
      const hasEnough = await airtableService.hasEnoughTokens(userId, amount);
      
      if (!hasEnough) {
        return res.status(403).json({
          success: false,
          message: 'Niewystarczająca ilość energii',
          requiredAmount: amount
        });
      }
      
      // Deduct energy using the Airtable service
      const updatedUser = await airtableService.deductTokens(userId, amount);
      
      return res.json({
        success: true,
        message: `${amount} jednostek energii odjęto pomyślnie`,
        deducted: amount,
        newBalance: updatedUser.tokenBalance || 0,
        mock: updatedUser.mock || false
      });
    } catch (dbError) {
      console.error('Database error while deducting tokens:', dbError);
      return res.status(500).json({
        success: false,
        message: dbError.message || 'Failed to deduct tokens due to database error'
      });
    }
  } catch (error) {
    console.error('Error in deduct-tokens endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add energy to user account
app.post('/api/add-tokens', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid parameters. userId and a positive amount are required.' 
      });
    }
    
    console.log(`Adding ${amount} energy units to user ${userId}`);
    
    try {
      // Add energy using the Airtable service
      const updatedUser = await airtableService.addTokens(userId, amount);
      
      return res.json({
        success: true,
        message: `${amount} jednostek energii dodano pomyślnie`,
        added: amount,
        newBalance: updatedUser.tokenBalance || 0,
        mock: updatedUser.mock || false
      });
    } catch (dbError) {
      console.error('Database error while adding tokens:', dbError);
      return res.status(500).json({
        success: false,
        message: dbError.message || 'Failed to add tokens due to database error'
      });
    }
  } catch (error) {
    console.error('Error in add-tokens endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user energy balance
app.get('/api/token-balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid parameters. userId is required.' 
      });
    }
    
    console.log(`Getting energy balance for user ${userId}`);
    
    // Get user record from Airtable
    try {
      const user = await airtableService.getUserRecord(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User ${userId} not found`
        });
      }
      
      return res.json({
        success: true,
        userId,
        balance: user.tokenBalance || 0,
        mock: user.mock || false
      });
    } catch (dbError) {
      console.error('Database error while fetching token balance:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Failed to get token balance due to database error'
      });
    }
  } catch (error) {
    console.error('Error in token-balance endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Stripe Payment routes

// Create payment intent for energy purchase
app.post('/api/create-payment', async (req, res) => {
  try {
    const { packageId, userId } = req.body;
    
    // Get package details from configuration (would typically be in a database)
    const energyPackages = [
      { id: 'mini', name: 'Mini Energia', amount: 100, price: 4.99 },
      { id: 'basic', name: 'Podstawowa Energia', amount: 500, price: 19.99 },
      { id: 'standard', name: 'Standardowa Energia', amount: 1200, price: 39.99 },
      { id: 'premium', name: 'Premium Energia', amount: 3000, price: 79.99 },
      { id: 'enterprise', name: 'Energia Biznesowa', amount: 10000, price: 199.99 }
    ];
    
    const selectedPackage = energyPackages.find(pkg => pkg.id === packageId);
    
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package selected' });
    }
    
    // Convert price to cents as Stripe requires
    const amount = Math.round(selectedPackage.price * 100);
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'pln',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        packageId,
        tokenAmount: selectedPackage.amount.toString()
      }
    });

    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      amount: selectedPackage.price,
      tokenAmount: selectedPackage.amount
    });
  } catch (e) {
    console.error('Error creating payment intent:', e);
    res.status(500).json({ error: e.message });
  }
});

// Webhook handler for asynchronous events
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  let event;
  
  try {
    // Verify the event came from Stripe
    const signature = req.headers['stripe-signature'];
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { userId, tokenAmount } = paymentIntent.metadata;
      
      console.log(`Payment for ${userId} succeeded, adding ${tokenAmount} energy units`);
      
      // Here you would update the user's energy balance in your database
      // For example: await addTokens(userId, parseInt(tokenAmount));
      
      // TODO: Implement actual energy crediting with Airtable
      // This will be handled by the addTokens endpoint
      try {
        // Call our own API endpoint to add energy
        await axios.post(`http://localhost:${PORT}/api/add-tokens`, {
          userId,
          amount: parseInt(tokenAmount)
        });
        console.log(`Energy added successfully for user ${userId}`);
      } catch (error) {
        console.error(`Failed to add energy for user ${userId}:`, error.message);
      }
      
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
========================================
  Career API Server running on port ${PORT}
========================================
  Environment: ${process.env.NODE_ENV || 'development'}
  
  Enabled Features:
  - Content Generation: ${!!process.env.VITE_LLM_API_KEY ? '✅' : '❌'}
  - Image Generation: ${!!process.env.IMAGINE_API_KEY ? '✅' : '❌'}
  - Stripe Payments: ${!!process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}
  - Airtable Database: ${!!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) ? '✅' : '❌ (using mock mode)'}
  
  API ready at: http://localhost:${PORT}
========================================
`);
});
