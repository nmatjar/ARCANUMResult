import { API_CONFIG } from './apiService';
import { updateUserData } from './airtableService';

/**
 * Generate avatar in specified style and update user's Airtable record
 * @param {string} userId - User's Airtable ID
 * @param {string} style - Style identifier (realistic, anime, cartoon, etc.)
 * @param {string} profileDescription - Description of the person for avatar generation
 * @returns {Promise<object>} Result of the operation
 */
export const generateAvatarWithStyle = async (userId, style, profileDescription) => {
  try {
    // Skip token check completely - let server handle test mode
    // Avatar generation always costs 0 tokens in test mode on server side
    const skipTokenCheck = true; // Always skip for avatar generation
    
    // Create style-specific prompt modifiers
    const styleModifiers = {
      'realistic': 'ultra realistic portrait, photorealistic, detailed facial features, real person',
      'anime': 'anime style portrait, manga inspired, big eyes, stylized features',
      'cartoon': 'cartoon style portrait, exaggerated features, simple lines, colorful',
      'pixar': 'Pixar style 3D rendered portrait, detailed, expressive face',
      'minecraft': 'low-poly blocky Minecraft style, pixelated, geometric shapes, vibrant colors',
      'fantasy': 'fantasy portrait, magical atmosphere, otherworldly features',
      'cyberpunk': 'cyberpunk portrait, neon lights, futuristic elements, tech-enhanced features',
      'steampunk': 'steampunk portrait, victorian style, mechanical elements, brass accents',
      'watercolor': 'watercolor style portrait, soft edges, artistic painted quality',
      'oil-painting': 'oil painting portrait in the style of classic portraiture, textured brush strokes',
      'comic': 'comic book style portrait, bold outlines, vibrant colors, action pose'
    };
    
    // Get the style modifier or use realistic as default
    const styleModifier = styleModifiers[style] || styleModifiers.realistic;
    
    // Extract basic demographics from profile description
    const genderMatch = profileDescription.match(/(Kobieta|Mężczyzna|Osoba)/i) || ["Osoba"];
    const gender = genderMatch[0].toLowerCase();
    const ageMatch = profileDescription.match(/(\d+)\s*lat/i) || ["30 lat"];
    const age = ageMatch[0];
    
    // Extract personality and professional elements
    const personalityMatch = profileDescription.match(/typ osobowości\s*(\w+)/i) || ["nieznany"];
    const personality = personalityMatch[0];
    const jobMatch = profileDescription.match(/pracuje jako\s*([^,\.]+)/i) || ["specjalista"];
    const job = jobMatch[0];
    const interestsMatch = profileDescription.match(/interesuje się\s*([^,\.]+)/i) || ["różnymi tematami"];
    const interests = interestsMatch[0];

    // Create style-specific prompt format
    let prompt;
    
    if (style === 'minecraft' || style === 'pixar') {
      // Special format for cartoon/blocky styles
      prompt = `Low-Poly style ${gender}, ${age}. Full body standing portrait with white background. 
      Characteristics: ${personality}, works as ${job}, interested in ${interests}. 
      Vibrant colors, geometric design, ${styleModifier}. High quality, 4K render.`;
    } else {
      // Standard format for realistic/artistic styles
      prompt = `Full body standing portrait of ${gender}, ${age}. ${styleModifier}. 
      Full body, white background, neutral pose, detailed, high quality, 4K.
      Characteristics: ${personality}, works as ${job}.`;
    }
    
    // Skip token checking completely for avatar generation
    if (!skipTokenCheck) {
      // This code is never executed now, but left as reference
      console.log('Would check tokens here if not skipped');
    } else {
      console.log('Skipping token check for avatar generation - using direct image generation');
    }
    
    // Generate image using existing image generation API
    const imageResponse = await fetch(`${API_CONFIG.current.baseUrl}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt
      })
    });
    
    if (!imageResponse.ok) {
      throw new Error('Failed to generate avatar image');
    }
    
    const imageResult = await imageResponse.json();
    
    console.log('Image generation result:', imageResult);
    
    // Get all generated image URLs (typically 4 from MidJourney)
    let avatarUrl = null;
    
    // Use the first URL from upscaledUrls array if available (this should have all 4 variations)
    if (imageResult.upscaledUrls && Array.isArray(imageResult.upscaledUrls) && imageResult.upscaledUrls.length > 0) {
      console.log(`Found ${imageResult.upscaledUrls.length} images from MidJourney`);
      avatarUrl = imageResult.upscaledUrls[0]; // Use the first image
    } else if (imageResult.url) {
      // Fallback to main URL if upscaled versions aren't available
      avatarUrl = imageResult.url;
    }
    
    if (!avatarUrl) {
      throw new Error('No avatar URL returned from image generation');
    }
    
    console.log('Selected avatar URL:', avatarUrl);
    
    // Update the user's Airtable record with the new avatar
    await updateUserData(userId, {
      'Avatar': avatarUrl
    });
    
    return {
      success: true,
      avatarUrl
    };
    
  } catch (error) {
    console.error('Error generating avatar:', error);
    return {
      success: false,
      message: error.message || 'Wystąpił błąd podczas generowania avatara'
    };
  }
};