import { useNavigate } from "react-router-dom";
import logo from "../assets/imgs/vinted-logo.png";
import Filters from "./Filters";
import "../assets/css/header.css";

const Header = ({ token, setUser, onFilterChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Supprime le token utilisateur
    navigate("/"); // Redirige vers l'accueil
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src={logo} alt="Vinted Logo" onClick={() => navigate("/")} />
      </div>

      {/* Intégration des filtres dans le header */}
      <Filters onFilterChange={onFilterChange} />

      <div className="header-buttons">
        {token ? (
          <button onClick={handleLogout}>Se déconnecter</button>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Se connecter</button>
            <button onClick={() => navigate("/signup")}>S'inscrire</button>
          </>
        )}
        <button onClick={() => navigate("/publish")}>Vends tes articles</button>
      </div>
    </header>
  );
};

export default Header;
