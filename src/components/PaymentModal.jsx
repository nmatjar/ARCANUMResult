import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../config/stripeConfig';
import { StripePaymentForm } from './StripePaymentForm';
import '../assets/styles/PaymentModal.css';
import { useUserContext } from '../contexts/UserContext';
import { ENV } from '../services/apiService';

export const PaymentModal = ({ packages, userId, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('selecting'); // selecting, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const { userData } = useUserContext();
  
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };
  
  const handleProceedToPayment = async () => {
    if (!selectedPackage) {
      setErrorMessage('Proszę wybrać pakiet tokenów');
      return;
    }
    
    if (!userId) {
      setErrorMessage('Brak ID użytkownika. Prosimy o ponowne zalogowanie.');
      return;
    }
    
    setPaymentStatus('processing');
    
    try {
      // Get API base URL based on current environment
      const apiBaseUrl = ENV.current === 'production' 
        ? 'https://career-api-production.up.railway.app' 
        : 'http://localhost:3001';
        
      // Create a payment intent through our API
      const response = await fetch(`${apiBaseUrl}/api/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPackage.id, userId })
      });
      
      const paymentData = await response.json();
      
      if (paymentData.clientSecret) {
        console.log('Payment intent created:', paymentData);
        
        // Store the payment intent data and move to the payment form
        setPaymentIntent({
          clientSecret: paymentData.clientSecret,
          amount: paymentData.amount,
          tokenAmount: paymentData.tokenAmount
        });
        
        setPaymentStatus('paying');
      } else {
        throw new Error('No client secret returned from the server');
      }
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('error');
      setErrorMessage('Wystąpił błąd podczas inicjowania płatności. Prosimy spróbować ponownie.');
    }
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    setPaymentStatus('success');
    
    // In production, token balance update happens via webhook
    // For testing, wait 2 seconds and close modal
    setTimeout(() => {
      onClose();
      window.location.reload(); // Force refresh to show updated token count
    }, 2000);
  };
  
  // Handle payment error
  const handlePaymentError = (errorMessage) => {
    console.error('Payment error:', errorMessage);
    setPaymentStatus('error');
    setErrorMessage(errorMessage);
  };
  
  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <div className="payment-header">
          <h2>Doładuj energię</h2>
          <p>Wybierz pakiet energii, który najlepiej odpowiada Twoim potrzebom</p>
          <div className="test-mode-badge">Tryb testowy</div>
        </div>
        
        {paymentStatus === 'selecting' && (
          <>
            <div className="packages-container">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <h3>{pkg.name}</h3>
                  <div className="token-amount">
                    <i className="fa-solid fa-bolt"></i>
                    <span>{pkg.amount} jednostek energii</span>
                  </div>
                  <div className="package-price">{pkg.price} zł</div>
                  {selectedPackage?.id === pkg.id && (
                    <div className="selected-badge">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <button 
              className="proceed-button" 
              onClick={handleProceedToPayment}
              disabled={!selectedPackage}
            >
              Przejdź do płatności
            </button>
            
            <p className="payment-info">
              W trybie demo, płatność zostanie zasymulowana. 
              W produkcji, zostaniesz przekierowany do bezpiecznej bramki płatności.
            </p>
          </>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="payment-status">
            <div className="payment-spinner"></div>
            <h3>Inicjowanie płatności...</h3>
            <p>Prosimy o cierpliwość, trwa przygotowywanie płatności.</p>
          </div>
        )}
        
        {paymentStatus === 'paying' && paymentIntent && (
          <div className="payment-form-container">
            <h3>Płatność kartą</h3>
            <p>Wybrano pakiet: <strong>{selectedPackage.name}</strong> - {selectedPackage.amount} jednostek energii</p>
            
            <Elements stripe={getStripe()}>
              <StripePaymentForm 
                clientSecret={paymentIntent.clientSecret}
                amount={paymentIntent.amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="payment-status success">
            <i className="fa-solid fa-check-circle"></i>
            <h3>Płatność zrealizowana!</h3>
            <p>Energia została dodana do Twojego konta.</p>
            <p>Dziękujemy za zakup!</p>
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className="payment-status error">
            <i className="fa-solid fa-exclamation-circle"></i>
            <h3>Wystąpił błąd</h3>
            <p>{errorMessage}</p>
            <button className="retry-button" onClick={() => setPaymentStatus('selecting')}>
              Spróbuj ponownie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};