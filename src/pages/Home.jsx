// useState : pour les annonces, l'état de chargement
// useEffect : pour recharger les annonces si on change de page ou de filtres
import { useState, useEffect } from "react";
// Link : pour les liens internes sans recharger la page entière.
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/css/homePage.css";
import hero from "../assets/imgs/hero.png";

//props filters envoyés depuis le header
const Home = ({ filters }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  //page = page actuelle, initialisé à 1 pour afficher page 1
  const [page, setPage] = useState(1);
  //initialisé à 1 pour ne pas avoir undefined

  const [totalPages, setTotalPages] = useState(1);

  // Cette fonction va chercher les annonces dans l'API + Elle est appelée dès qu'on change de page ou de filtres.
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // On prépare les paramètres qu'on va envoyer à l'API pour récupérer seulement les annonces qu'on veut.
        const params = {
          page,
          limit: 10,
          title: filters.search || undefined,
          priceMin: filters.priceMin || undefined,
          priceMax: filters.priceMax || undefined,
          sort: filters.sort || undefined,
        };

        // requête GET pour récupérer les annonces.
        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/v2/offers",
          { params }
        );

        // MAJ des annonces
        setOffers(response.data.offers);
        // calcule du nb total de pages. Math.ceil pour arrondir à l'entier sup
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces :", error);
      }
    };

    // On appelle la fetchOffers() dès qu'on arrive ici .
    fetchOffers();
    // ou dès qu'une dépendance change les filtres ou la page
  }, [filters, page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="home-container">
      <div className="hero">
        <img src={hero} alt="Hero" />
        <h1>Bienvenue sur Vinted</h1>{" "}
      </div>

      {/* Ici, on affiche les annonces récupérées. */}
      <div className="offers">
        {offers.map((offer) => (
          // Chaque annonce est un lien qui mène à sa page de détails.
          <Link
            // Le lien pointe vers la route de l'annonce avec son ID
            to={`/offer/${offer._id}`}
            key={offer._id}
            className="offer-card"
          >
            <img
              src={offer.product_image.secure_url}
              alt={offer.product_name}
            />
            <div>
              <h3>{offer.product_name}</h3>
              <p>{offer.product_price} €</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Naviguer entre les pages */}
      <div className="pagination">
        {/* Bouton page précédente. disabled sur la page 1 */}
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Précédent
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>
        {/* Bouton page suivante */}
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Home;
