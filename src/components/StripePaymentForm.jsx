import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../assets/styles/StripePaymentForm.css';

export const StripePaymentForm = ({ clientSecret, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  
  // Reset state when clientSecret changes
  useEffect(() => {
    setErrorMessage('');
    setProcessing(false);
    setSucceeded(false);
  }, [clientSecret]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet, disable form submission
      return;
    }
    
    setProcessing(true);
    
    // Get the card element
    const cardElement = elements.getElement(CardElement);
    
    try {
      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      
      if (error) {
        setErrorMessage(error.message);
        setProcessing(false);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setProcessing(false);
        onSuccess(paymentIntent);
      } else {
        setErrorMessage(`Payment status: ${paymentIntent.status}. Please try again.`);
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setProcessing(false);
      onError(err.message);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };
  
  return (
    <form className="stripe-payment-form" onSubmit={handleSubmit}>
      <div className="card-element-container">
        <CardElement options={cardElementOptions} />
      </div>
      
      {errorMessage && (
        <div className="payment-error">
          {errorMessage}
        </div>
      )}
      
      <button 
        type="submit" 
        className="payment-button" 
        disabled={!stripe || processing || succeeded}
      >
        {processing ? 'Przetwarzanie...' : `Zapłać ${amount} zł`}
      </button>
      
      <div className="payment-info">
        <p>Test Card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date | CVC: Any 3 digits</p>
      </div>
    </form>
  );
};