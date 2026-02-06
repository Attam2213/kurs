import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import SEO from './components/SEO';

const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SEO />
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <BookingForm />
            <Features />
          </main>
        } />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <HelmetProvider>
        <Router>
          <MainLayout />
        </Router>
      </HelmetProvider>
    </SettingsProvider>
  );
}

export default App;
