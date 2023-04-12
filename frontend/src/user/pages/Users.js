import React, { useState, useEffect } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import UsersList from "../components/UsersList";

const Users = () => {
  const [error, setError] = useState();
  const [utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    const envoyerRequete = async () => {
      try {
        const reponse = await fetch("http://localhost:5000/api/utilisateurs");

        const reponseData = await reponse.json();
        console.log(reponseData);
        if (!reponse.ok) {
          throw new Error(reponseData.message);
        }
        setUtilisateurs(reponseData.utilisateurs);
      } catch (err) {
        setError(err.message);
      }
    };
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <UsersList items={utilisateurs} />;
    </React.Fragment>
  );
};

export default Users;
