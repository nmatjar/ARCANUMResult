import React from 'react';
import '../assets/styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="#" title="O nas">O nas</a>
          <a href="/help" title="Pomoc">Pomoc</a>
          <a href="#" title="Kontakt">Kontakt</a>
          <a href="#" title="Polityka prywatności">Polityka prywatności</a>
        </div>
        <p>&copy; {currentYear} Inteligentna Kariera. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
};