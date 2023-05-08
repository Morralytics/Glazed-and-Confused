import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useStoreContext } from '../../utils/GlobalState';
require('dotenv').config();

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutButton() {
  const stripe = useStripe();

  const [state, dispatch] = useStoreContext();
  const [currentOrder, setCurrentOrder] = useState({});
  const { userOrders, order } = state;
  let orderNum;


  const handleClick = async () => {
    orderNum = order;
    setCurrentOrder({ orderNum })

    let numberOfDonuts = 0;
    for (let i = 0; i < state.order.length; i++) {
      numberOfDonuts = numberOfDonuts + state.order[i].purchaseQuantity;
    }

    for (let i = 0; i < userOrders.length; i++) {
      if (userOrders[i] === orderNum) {
        console.log('dup')
      } else {
        return
      }
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_1Mxy4uBFISeLbxNY2XKAcfut', quantity: numberOfDonuts }],
      mode: 'payment',

      //For deployment
      successUrl: 'https://glazed-and-confused-app.herokuapp.com/ThankYou',
      cancelUrl: 'https://glazed-and-confused-app.herokuapp.com/ThankYou',

      //For local development
      // successUrl: 'http://localhost:3000/ThankYou',
      // cancelUrl: 'http://localhost:3000/ThankYou',
    });

    if (error) {
      console.log(error);
    }
  }
  return (
    <button className="cart-summary-btn btn-blue btn-small" onClick={handleClick}>Checkout</button>
  );
}

function CheckoutUseStripe() {
  return (
    <footer className='footer-bottom'>
      <Elements stripe={stripePromise}>
        <CheckoutButton />
      </Elements>
    </footer>
  );
};

export default CheckoutUseStripe;
