import { Alert, AlertTitle, Skeleton } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PaymentForm from './PaymentForm';
import { createStripePaymentSecret } from '../../store/actions/index';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () => {
  const dispatch = useDispatch();
  const { clientSecret } = useSelector((state) => state.auth);
  const { totalPrice } = useSelector((state) => state.carts);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { user, selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!clientSecret && totalPrice > 0) {
      const sendData = {
        amount: Math.round(Number(totalPrice) * 100),
        currency: "usd",
        email: user?.email,
        name: user?.username,
        address: selectedUserCheckoutAddress,
        description: `Order for ${user?.email}`,
        metadata: { test: "1" }
      };
      dispatch(createStripePaymentSecret(sendData));
    }
  }, [dispatch, clientSecret, totalPrice, user, selectedUserCheckoutAddress]);

  // Clear client secret if price or address changes to ensure fresh payment intent
  useEffect(() => {
    return () => {
      // Optional: clear on unmount if requested
    };
  }, []);

  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!stripePublishableKey) {
    return (
      <div className='max-w-lg mx-auto mt-10'>
        <Alert severity="error">
          <AlertTitle>Stripe Configuration Error</AlertTitle>
          Stripe Publishable Key is missing! Please set <strong>VITE_STRIPE_PUBLISHABLE_KEY</strong> in your environment variables.
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='max-w-lg mx-auto mt-10'>
        <div className='flex flex-col items-center gap-4'>
           <Skeleton variant="rectangular" width="100%" height={200} />
           <p className='text-gray-500 animate-pulse'>Initializing secure payment gateway...</p>
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className='max-w-lg mx-auto mt-10'>
        <Alert severity="error">
          <AlertTitle>Payment Error</AlertTitle>
          {errorMessage}. Please try refreshing the page or contact support.
        </Alert>
      </div>
    )
  }


  return (
    <div className='min-h-[400px]'>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice} />
        </Elements>
      ) : (
        <div className='max-w-lg mx-auto mt-10 text-center text-gray-500'>
           {!isLoading && !errorMessage && <p>Preparing your order...</p>}
        </div>
      )}
    </div>
  )
}

export default StripePayment