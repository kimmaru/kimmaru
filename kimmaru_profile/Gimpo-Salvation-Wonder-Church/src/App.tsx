import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import PastorGreeting from './pages/PastorGreeting';
import ServiceTime from './pages/ServiceTime';
import Location from './pages/Location';
import Sermon from './pages/Sermon';
import Media from './pages/Media';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <div className="App">
        <Header />
                      <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/pastor" element={<PastorGreeting />} />
            <Route path="/about/service" element={<ServiceTime />} />
            <Route path="/about/location" element={<Location />} />
            <Route path="/sermon" element={<Sermon />} />
            <Route path="/media" element={<Media />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;