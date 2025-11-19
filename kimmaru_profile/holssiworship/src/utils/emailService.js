// 참고: 실제 환경에서는 emailjs-com 패키지를 설치하고 import해야 합니다
// import emailjs from 'emailjs-com';

/**
 * 이메일 서비스 초기화 (실제 구현시 활성화)
 */
// emailjs.init("yxBAxcfLA_8P2COm4");

/**
 * Send form data via EmailJS
 * 
 * @param {Object} formData - Form data to send
 * @param {string} formData.inquiry_title - Title of the inquiry
 * @param {string} formData.name - Name of the sender
 * @param {string} formData.email - Email of the sender
 * @param {string} formData.phone - Phone number of the sender
 * @param {string} formData.message - Message content
 * @param {string} recaptchaToken - reCAPTCHA token for verification
 * @returns {Promise} - Promise resolving to the EmailJS response
 */
export const sendContactForm = async (formData, recaptchaToken) => {
  try {
    // 실제 환경에서는 아래 주석을 해제하고 사용합니다
    /*
    // Create template parameters
    const templateParams = {
      title: formData.inquiry_title,
      name: formData.name || "이름 미입력",
      email: formData.email,
      phone: formData.phone || "연락처 없음",
      message: formData.message,
      contact_source: 'holssiworship.github.io',
      'g-recaptcha-response': recaptchaToken
    };
    
    // Send email using EmailJS
    const response = await emailjs.send(
      'service_2jixwit',
      'template_krrg5f9', 
      templateParams
    );
    
    return {
      success: true,
      status: response.status,
      text: response.text
    };
    */
    
    // 현재 예시용 응답
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          status: 200,
          text: 'OK'
        });
      }, 1500);
    });
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      status: error.status || 500,
      text: error.text || 'An error occurred'
    };
  }
};