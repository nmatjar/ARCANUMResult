/* eslint-env node */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Log to verify environment variable
    console.log(`OpenRouter API Key Status: ${process.env.OPENROUTER_API_KEY ? 'Loaded' : 'MISSING'}`);

    const { prompt, model, systemPrompt, options, context } = JSON.parse(event.body);

    // Połącz kontekst (MetaAnalysis) z promptem, jeśli istnieje
    const userContent = context ? `${context}\n\n---\n\n${prompt}` : prompt;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        ...options,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
