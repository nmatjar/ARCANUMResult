/**
 * Utility functions for image handling in the application
 */

/**
 * For backward compatibility
 * @returns {String} Default fallback image
 */
export const getFallbackImageUrl = () => {
  return 'https://img.freepik.com/free-photo/cozy-workspace-with-laptop-coffee-books-warm-lighting_23-2149241242.jpg';
};

/**
 * Generates a search query for Freepik based on user data
 * @param {Object} userData User profile data from Airtable
 * @param {String} defaultQuery Default search query if user data is insufficient
 * @returns {String} Optimized search query for Freepik API
 */
export const generateFreepikSearchQuery = (userData, defaultQuery = 'modern professional workspace') => {
  if (!userData) return defaultQuery;

  const traits = [];

  // Add personality type if available
  if (userData.personality_type) {
    const personalityLower = userData.personality_type.toLowerCase();
    if (personalityLower.includes('introwert')) traits.push('quiet private workspace');
    if (personalityLower.includes('ekstrawert')) traits.push('collaborative open workspace');
    if (personalityLower.includes('kreatyw')) traits.push('creative colorful workspace');
    if (personalityLower.includes('analitycz')) traits.push('organized clean workspace');
  }

  // Add work style if available
  if (userData.work_style) {
    const workStyleLower = userData.work_style.toLowerCase();
    if (workStyleLower.includes('zespół')) traits.push('team office');
    if (workStyleLower.includes('samodzielnie')) traits.push('individual office');
    if (workStyleLower.includes('zdalnie')) traits.push('home office setup');
    if (workStyleLower.includes('biuro')) traits.push('corporate office');
  }

  // Add environment features if available
  if (userData.work_environment_features) {
    const featuresLower = userData.work_environment_features.toLowerCase();
    if (featuresLower.includes('spokój')) traits.push('calm workspace');
    if (featuresLower.includes('natura')) traits.push('natural elements office');
    if (featuresLower.includes('nowoczesn')) traits.push('high tech office');
    if (featuresLower.includes('tradycyj')) traits.push('traditional office');
  }

  // Add target job sector if available
  if (userData.sector) {
    const sectorLower = userData.sector.toLowerCase();
    if (sectorLower.includes('tech')) traits.push('tech startup office');
    if (sectorLower.includes('edukac')) traits.push('education workspace');
    if (sectorLower.includes('kreatyw')) traits.push('creative studio');
    if (sectorLower.includes('finans')) traits.push('finance office');
    if (sectorLower.includes('zdrow')) traits.push('healthcare workspace');
  }

  // Create final query
  const personalizedQuery = traits.length > 0 
    ? traits.slice(0, 3).join(' ') // Take top 3 traits to avoid too specific queries
    : defaultQuery;

  return personalizedQuery;
};

/**
 * Provides collection of workspace images based on personality type
 * @param {Object} userData - User profile data
 * @returns {String} Best matching workspace image URL
 */
export const getWorkspaceImageUrl = (userData) => {
  // Group images by personality type and workspace style
  const workspaceImages = {
    // For introverted personalities
    introvert: [
      'https://img.freepik.com/free-photo/cozy-workplace-home-office-setup-remote-work_23-2149319220.jpg',
      'https://img.freepik.com/free-photo/home-office-setup-with-laptop-notebook-cup-coffee_23-2148847096.jpg',
      'https://img.freepik.com/free-photo/side-view-workspace-composition-with-copy-space_23-2148409644.jpg'
    ],
    
    // For extroverted personalities
    extrovert: [
      'https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg',
      'https://img.freepik.com/free-photo/group-business-workers-smiling-happy-confident-working-together-with-smile-face-talking-office_1258-87136.jpg',
      'https://img.freepik.com/free-photo/business-team-having-meeting-modern-office_1150-1938.jpg'
    ],
    
    // For creative, artistic personalities
    creative: [
      'https://img.freepik.com/free-photo/modern-studio-office-creative-agency-with-artistic-design_23-2149393736.jpg',
      'https://img.freepik.com/free-photo/modern-office-space-with-desktops-with-modern-computers_23-2149139103.jpg',
      'https://img.freepik.com/free-photo/office-table-with-cup-coffee-keyboard-notepad_1220-4617.jpg'
    ],
    
    // For analytical, organized personalities
    analytical: [
      'https://img.freepik.com/free-photo/modern-equipped-computer-lab-classroom_23-2149241222.jpg',
      'https://img.freepik.com/free-photo/financial-report-magnifying-glass-white-office-desk_1232-3478.jpg',
      'https://img.freepik.com/free-photo/workspace-workplace-office-table-with-laptop_23-2147686581.jpg'
    ],
    
    // Default/generic workspace images
    default: [
      'https://img.freepik.com/free-photo/cozy-workspace-with-laptop-coffee-books-warm-lighting_23-2149241242.jpg',
      'https://img.freepik.com/free-photo/office-desk-with-laptop-work-supplies_23-2148177817.jpg',
      'https://img.freepik.com/free-photo/modern-office-interior-with-desk-computer_23-2149139094.jpg',
      'https://img.freepik.com/free-photo/office-desk-with-laptop-notebook-cup-coffee_144627-43440.jpg'
    ]
  };

  if (!userData) {
    // If no user data, return random image from default collection
    return workspaceImages.default[Math.floor(Math.random() * workspaceImages.default.length)];
  }

  // Determine best category based on user personality
  let bestCategory = 'default';
  
  if (userData.personality_type) {
    const personality = userData.personality_type.toLowerCase();
    
    if (personality.includes('introwert')) {
      bestCategory = 'introvert';
    } else if (personality.includes('ekstrawert')) {
      bestCategory = 'extrovert';
    } else if (personality.includes('kreatyw') || personality.includes('artyst')) {
      bestCategory = 'creative';
    } else if (personality.includes('analitycz') || personality.includes('logicz')) {
      bestCategory = 'analytical';
    }
  }

  // Get images for best category
  const categoryImages = workspaceImages[bestCategory];
  
  // Return random image from the best category
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};