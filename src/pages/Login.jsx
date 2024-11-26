import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../assets/css/logIn.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/login",
        { email, password }
      );

      if (response.data.token) {
        // Stocker le token dans un cookie
        Cookies.set("token", response.data.token, { expires: 7 });
        setUser(response.data.token);
        navigate("/"); // Redirection vers la page d'accueil
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Se connecter</h1>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Connexion</button>
        <p>
          Pas encore de compte ?{" "}
          <span onClick={() => navigate("/signup")}>Inscrivez-vous ici.</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
