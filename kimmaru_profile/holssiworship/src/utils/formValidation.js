/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates required fields in a form data object
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of field names that are required
 * @returns {Object} Validation result with isValid and error message
 */
export const validateRequiredFields = (formData, requiredFields) => {
  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === '') {
      return {
        isValid: false,
        errorMessage: `${field} 필드는 필수 입력 항목입니다.`
      };
    }
  }
  
  return { isValid: true, errorMessage: '' };
};

/**
 * Validates the contact form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid and error message
 */
export const validateContactForm = (formData) => {
  // Check required fields
  const requiredValidation = validateRequiredFields(
    formData, 
    ['inquiry_title', 'email', 'message']
  );
  
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }
  
  // Validate email format
  if (!validateEmail(formData.email)) {
    return {
      isValid: false,
      errorMessage: '유효한 이메일 주소를 입력해주세요.'
    };
  }
  
  return { isValid: true, errorMessage: '' };
};