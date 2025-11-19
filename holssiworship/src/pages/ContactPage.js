import React, { useRef, useState, useEffect } from 'react';
import ContactSection from '../sections/ContactSection';
import { validateContactForm } from '../utils/formValidation';
import { sendContactForm } from '../utils/emailService';

const ContactPage = () => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', isError: false });
  const formRef = useRef(null);
  
  // reCaptcha 오류 이벤트 리스너
  useEffect(() => {
    const handleRecaptchaError = (event) => {
      setFormStatus({
        message: event.detail.message,
        isError: true
      });
    };
    
    document.addEventListener('recaptchaError', handleRecaptchaError);
    
    return () => {
      document.removeEventListener('recaptchaError', handleRecaptchaError);
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // reCaptcha 토큰 가져오기
    const recaptchaToken = e.recaptchaToken;
    
    // Get form data
    const formData = new FormData(formRef.current);
    const data = {
      inquiry_title: formData.get('inquiry_title'),
      name: formData.get('name') || "이름 미입력",
      email: formData.get('email'),
      phone: formData.get('phone') || "연락처 없음",
      message: formData.get('message'),
      contact_source: 'holssiworship.github.io'
    };
    
    // Validate form
    const validation = validateContactForm(data);
    if (!validation.isValid) {
      setFormStatus({
        message: validation.errorMessage,
        isError: true
      });
      return;
    }
    
    // Submit form
    setIsFormSubmitting(true);
    setFormStatus({
      message: '문의를 전송 중입니다...',
      isError: false
    });
    
    try {
      // Call email service with reCaptcha token
      const response = await sendContactForm(data, recaptchaToken);
      
      if (response.success) {
        setFormStatus({
          message: '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.',
          isError: false
        });
        
        // Reset form
        formRef.current.reset();
        
        // Hide status message after 5 seconds
        setTimeout(() => {
          setFormStatus({ message: '', isError: false });
        }, 5000);
      } else {
        setFormStatus({
          message: response.message || '이메일 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
          isError: true
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (error.message.includes('reCAPTCHA')) {
        setFormStatus({
          message: 'reCAPTCHA 인증에 실패했습니다. 다시 시도해주세요.',
          isError: true
        });
      } else {
        setFormStatus({
          message: '시스템 오류가 발생했습니다. 나중에 다시 시도해주세요.',
          isError: true
        });
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <main>
      <ContactSection 
        formRef={formRef}
        handleSubmit={handleSubmit}
        isFormSubmitting={isFormSubmitting}
        formStatus={formStatus}
      />
    </main>
  );
};

export default ContactPage;