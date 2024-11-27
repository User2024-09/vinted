import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/publish.css";

const Publish = ({ token }) => {
  const navigate = useNavigate();

  // States pour le formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [pictures, setPictures] = useState([]);

  // Redirection si l'utilisateur n'est pas authentifié
  if (!token) {
    navigate("/login");
    return null;
  }

  const handleFileChange = (e) => {
    setPictures(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("condition", condition);
      formData.append("city", city);
      formData.append("brand", brand);
      formData.append("size", size);
      formData.append("color", color);

      // Ajout des images au FormData
      for (let i = 0; i < pictures.length; i++) {
        formData.append("picture", pictures[i]);
      }

      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Redirection vers la page de l'offre après la publication
      navigate(`/offer/${response.data._id}`);
    } catch (error) {
      console.error("Error publishing the offer:", error);
    }
  };

  return (
    <div className="publish-container">
      <h1>Publier une annonce</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="État"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Marque"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Taille"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <input
          type="text"
          placeholder="Couleur"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default Publish;
