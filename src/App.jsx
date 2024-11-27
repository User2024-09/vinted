import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Publish from "./pages/Publish";
import Header from "./components/Header";
import Payment from "./pages/Payment";

import "./assets/css/App.css";

// Clé publique Stripe
const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP"
);

const App = () => {
  // Gestion du Token pour l'authentification
  const [token, setToken] = useState(Cookies.get("token") || null);

  // Gestion des filtres
  const [filters, setFilters] = useState({
    search: "",
    priceMin: 0,
    priceMax: 999999,
    sort: "",
  });

  // Fonction pour définir ou supprimer le token utilisateur
  const setUser = (token) => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    } else {
      Cookies.remove("token");
    }
    setToken(token);
  };

  return (
    <BrowserRouter>
      <Header token={token} setUser={setUser} onFilterChange={setFilters} />
      <Routes>
        <Route path="/" element={<Home filters={filters} />} />
        <Route path="/offer/:id" element={<Offer />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/publish" element={<Publish token={token} />} />
        <Route
          path="/payment"
          element={
            token ? (
              <Elements stripe={stripePromise}>
                <Payment token={token} />
              </Elements>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
