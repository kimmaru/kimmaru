import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Social media icons - fixed at bottom right */}
      <div className="fixed bottom-10 right-6 md:right-8 z-10 flex flex-col items-end space-y-2">
        <div className="flex space-x-2">
          <a 
            href="https://www.instagram.com/holssi.worship" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors duration-300 bg-dark-lighter bg-opacity-70 p-2 rounded-full"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5} />
              <circle cx="12" cy="12" r="4.5" strokeWidth={1.5} />
              <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          
          <a 
            href="https://www.youtube.com/@HolssiWorship" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors duration-300 bg-dark-lighter bg-opacity-70 p-2 rounded-full"
            aria-label="YouTube"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 8.5l5.2 3.5-5.2 3.5v-7z" />
            </svg>
          </a>
          
          <a 
            href="mailto:holssiworship@gmail.com"
            className="text-white hover:text-primary transition-colors duration-300 bg-dark-lighter bg-opacity-70 p-2 rounded-full"
            aria-label="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright line at the bottom */}
      <div className="w-full py-2 bg-dark-lighter bg-opacity-25 backdrop-filter backdrop-blur-sm absolute bottom-0 left-0">
        <div className="container-fluid px-6 md:px-8 text-right">
          <p className="text-gray-400 text-xs">&copy; Holssi Worship</p>
        </div>
      </div>
    </>
  );
};

export default Footer;