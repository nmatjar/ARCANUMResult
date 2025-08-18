# Career API Server

This server acts as a backend for the Career Guidance web application, handling AI content generation via Anthropic Claude, token management, and payment processing.

## Features

- **Claude AI Integration**: Uses Anthropic's Claude API for generating career guidance content
- **Token System**: Manages user tokens for accessing premium features
- **Payment Processing**: Stripe integration for purchasing token packages
- **Image Generation**: Generates AI images using the Imagine API
- **Airtable Integration**: Uses Airtable as a database for user data and token balances
- **Request Logging**: All requests are logged to the console for monitoring
- **API Key Security**: Keeps API keys secure by not exposing them to the client

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Stripe account for payment processing
- Anthropic API key for Claude AI
- Airtable account for database (optional for development)

### Installation

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create `.env` file from the example: `cp .env.example .env`
4. Fill in your API keys and configuration in the `.env` file
5. Start the server: `npm start`

The server will be available at `http://localhost:3001`.

### Environment Variables

Create a `.env` file with the following variables:

```
# Server settings
PORT=3001
NODE_ENV=development

# Anthropic API key
VITE_LLM_API_KEY=your_anthropic_api_key_here

# Stripe configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Imagine API for image generation
IMAGINE_API_KEY=your_imagine_api_key_here

# Airtable configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_USERS_TABLE=your_users_table_name_here
```

## API Endpoints

### Content Generation

- `POST /api/generate` - Generate AI content using Claude
  - Request:
  ```json
  {
    "prompt": "Text prompt for Claude",
    "systemPrompt": "System instructions (optional)",
    "maxTokens": 1024,
    "temperature": 0.7,
    "generateImage": false,
    "imagePrompt": null
  }
  ```
  - Response:
  ```json
  {
    "success": true,
    "content": "Claude's response text",
    "imageUrl": null,
    "imageAttribution": null
  }
  ```

### Token Management

- `GET /api/token-packages` - Get available token packages
  - Response:
  ```json
  {
    "success": true,
    "packages": [
      {
        "id": "basic",
        "name": "Basic Pack",
        "amount": 500,
        "price": 19.99,
        "description": "Great for occasional users"
      },
      ...
    ]
  }
  ```

- `GET /api/token-balance/:userId` - Get user's token balance
  - Response:
  ```json
  {
    "success": true,
    "userId": "user123",
    "balance": 500
  }
  ```

- `POST /api/deduct-tokens` - Deduct tokens from user account
  - Request:
  ```json
  {
    "userId": "user123",
    "amount": 100
  }
  ```
  - Response:
  ```json
  {
    "success": true,
    "message": "100 tokens deducted successfully",
    "deducted": 100,
    "newBalance": 400
  }
  ```

- `POST /api/add-tokens` - Add tokens to user account
  - Request:
  ```json
  {
    "userId": "user123",
    "amount": 200
  }
  ```
  - Response:
  ```json
  {
    "success": true,
    "message": "200 tokens added successfully",
    "added": 200,
    "newBalance": 600
  }
  ```

### Payments

- `POST /api/create-payment` - Create a Stripe payment intent
  - Request:
  ```json
  {
    "packageId": "basic",
    "userId": "user123"
  }
  ```
  - Response:
  ```json
  {
    "clientSecret": "pi_..._secret_...",
    "publishableKey": "pk_test_...",
    "amount": 19.99,
    "tokenAmount": 500
  }
  ```

- `POST /api/webhook` - Stripe webhook for payment event handling

### Image Generation

- `POST /api/generate-image` - Generate AI image
  - Request:
  ```json
  {
    "prompt": "Image description"
  }
  ```

## Development

### Mock Mode

The server supports a mock mode when Airtable credentials are not provided, allowing for local development without external dependencies.

### Testing Payments

For testing Stripe payments, use the following test card:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Deployment

The server is ready to deploy to platforms like:
- Railway
- Heroku
- Vercel
- AWS

Remember to set the appropriate environment variables on your deployment platform.