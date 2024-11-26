import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP"
);

const Payment = ({ token }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, price } = location.state || {};

  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (!title || !price) {
          throw new Error(
            "Informations manquantes. Redirection vers la page d'accueil."
          );
        }

        const response = await axios.post(
          "https://lereacteur-vinted-api.herokuapp.com/v2/payment",
          {
            title,
            amount: price * 100,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data.clientSecret) {
          throw new Error("Erreur lors de la génération du client secret.");
        }
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Erreur lors de la récupération du client secret :", err);
        setError(err.message || "Erreur inconnue.");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    fetchClientSecret();
  }, [title, price, token, navigate]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!clientSecret) {
    return <p>Chargement...</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe n'est pas initialisé correctement.");
      setIsLoading(false);
      return;
    }

    try {
      const stripeResponse = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/",
        },
        redirect: "if_required",
      });

      if (stripeResponse.error) {
        setErrorMessage(stripeResponse.error.message);
      } else if (stripeResponse.paymentIntent.status === "succeeded") {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement :", error);
      setErrorMessage("Une erreur est survenue pendant le paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  return completed ? (
    <p>Paiement effectué avec succès !</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements || isLoading}>
        Payer
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default Payment;
