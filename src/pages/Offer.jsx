import { useParams, useNavigate } from "react-router-dom"; // Gestion des routes
import { useEffect, useState } from "react"; // Gestion des états et des effets
import axios from "axios"; // Pour effectuer les requêtes API
import "../assets/css/offerPage.css"; // Styles spécifiques à la page

const Offer = () => {
  const { id } = useParams(); // Récupère l'ID de l'annonce depuis l'URL
  const navigate = useNavigate(); // Permet de rediriger vers d'autres pages

  const [offer, setOffer] = useState(null); // Stocke les données de l'annonce
  const [isLoading, setIsLoading] = useState(true); // Gère l'état de chargement

  // Récupération des données de l'annonce à partir de l'API
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        // Appel à l'API pour obtenir les détails de l'annonce
        const response = await axios.get(
          `https://lereacteur-vinted-api.herokuapp.com/offer/${id}`
        );
        setOffer(response.data); // Mise à jour des données de l'annonce
        setIsLoading(false); // Fin du chargement
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
      }
    };

    fetchOffer(); // Appel de la fonction
  }, [id]); // Exécution de l'effet lorsqu'on change d'ID dans l'URL

  // Fonction appelée lorsqu'on clique sur "Acheter"
  const handleBuy = () => {
    // Redirige vers la page de paiement en passant les données nécessaires
    navigate("/payment", {
      state: {
        title: offer.product_name, // Titre de l'annonce
        price: offer.product_price, // Prix de l'annonce
      },
    });
  };

  // Si les données sont en cours de chargement, afficher un message
  if (isLoading) {
    return <p>Chargement...</p>;
  }

  // Affichage des détails de l'annonce
  return (
    <div className="offer-container">
      {/* Section image du produit */}
      <div className="offer-image">
        <img src={offer.product_image?.secure_url} alt={offer.product_name} />
      </div>

      {/* Section détails du produit */}
      <div className="offer-details">
        <h1>{offer.product_name}</h1>
        <p>{offer.product_description}</p>
        <p className="offer-price">{offer.product_price} €</p>

        {/* Section des détails supplémentaires */}
        <div className="offer-product-details">
          {offer.product_details.map((detail, index) => (
            <div key={index} className="detail-item">
              <span>{Object.keys(detail)[0]}: </span>
              <span>{Object.values(detail)[0]}</span>
            </div>
          ))}
        </div>

        {/* Informations sur le propriétaire */}
        <div className="offer-owner">
          <img
            src={offer.owner.account.avatar?.secure_url}
            alt={offer.owner.account.username}
            className="owner-avatar"
          />
          <span>{offer.owner.account.username}</span>
        </div>

        {/* Bouton pour acheter */}
        <button className="buy-button" onClick={handleBuy}>
          Acheter
        </button>
      </div>
    </div>
  );
};

export default Offer;
