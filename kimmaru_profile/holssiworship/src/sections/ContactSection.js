import React, { useState, useRef } from 'react';
import { FaInstagram, FaYoutube, FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import BackgroundWithOverlay from '../components/BackgroundWithOverlay';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setSubmitStatus({
        type: 'error',
        message: 'reCaptcha 인증을 완료해주세요.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        'g-recaptcha-response': recaptchaToken
      };

      await emailjs.send(
        'service_b8pjl7d',
        'template_kq5z5to',
        templateParams,
        '6LcbfAIrAAAAACcU37epJX6NSSfNTpH8V6dD-5yA'
      );

      setSubmitStatus({
        type: 'success',
        message: '메시지가 성공적으로 전송되었습니다!'
      });

      setFormData({ name: '', email: '', message: '' });
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);

    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus({
        type: 'error',
        message: '메시지 전송에 실패했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      icon: FaInstagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/holssi.worship/',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaYoutube,
      label: 'YouTube',
      url: 'https://www.youtube.com/@holssiworship',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      url: 'mailto:holssiworship@gmail.com',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <BackgroundWithOverlay overlayOpacity={1.0}>
              <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
                             <h3 className="text-2xl font-bold text-white mb-6">문의</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    메시지 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                    placeholder="안녕하세요! 홀씨워십에 관심이 있어서 연락드립니다..."
                  />
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LcbfAIrAAAAACcU37epJX6NSSfNTpH8V6dD-5yA"
                    onChange={onRecaptchaChange}
                    theme="dark"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken}
                  className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '전송 중...' : '메시지 보내기'}
                </button>
              </form>

              {submitStatus && (
                <div className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-300'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaExclamationTriangle className="text-red-400" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}
            </div>

            {/* Social Links & Info */}
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
                <h3 className="text-2xl font-bold text-white mb-6">소셜 미디어</h3>
                <div className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-300 group"
                    >
                      <div className={`p-3 rounded-full bg-gradient-to-r ${link.color} group-hover:scale-110 transition-transform duration-300`}>
                        <link.icon className="text-white text-xl" />
                      </div>
                      <div>
                                                 <span className="text-white font-medium">{link.label}</span>
                         <p className="text-gray-400 text-sm">
                           {link.label === 'Instagram' && '홀씨워십 인스타그램'}
                           {link.label === 'YouTube' && '홀씨워십 유튜브'}
                           {link.label === 'Email' && '홀씨워십 이메일'}
                         </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
                <h3 className="text-2xl font-bold text-white mb-6">연락 정보</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-primary font-semibold mb-2">이메일</h4>
                    <p>holssiworship@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="text-primary font-semibold mb-2">활동 지역</h4>
                    <p>대한민국 전국</p>
                  </div>
                  <div>
                    <h4 className="text-primary font-semibold mb-2">문의 분야</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 예배 인도 요청</li>
                      <li>• 콜라보레이션 제안</li>
                      <li>• 워십 세션 문의</li>
                      <li>• 기타 문의 사항</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BackgroundWithOverlay>
  );
};

export default ContactSection;