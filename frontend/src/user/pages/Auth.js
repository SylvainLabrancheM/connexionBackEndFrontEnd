import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    
    if (isLoginMode) {
      
    } else {
      try {
        
        const reponse = await fetch('http://localhost:5000/api/utilisateurs/inscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nom: formState.inputs.name.value,
            courriel: formState.inputs.email.value,
            motDePasse: formState.inputs.password.value
          })
        });
        
        const reponseData = await reponse.json();
        
        if (!reponse.ok) { 
          throw new Error(reponseData.message);
        }

        console.log(reponseData);
        auth.login();
      } catch (err) {
        
        console.log(err);
        
        setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    }


    
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={errorHandler} />
    <Card className="authentication">
      <h2>Connexion requise</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="Courriel"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Entrez un courriel valide."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Mot de passe"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Entrez un mot de passe valide, au moins 5 caractères."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'Connexion' : 'Inscription'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        Changer pour {isLoginMode ? 'Inscription' : 'Connexion'}
      </Button>
    </Card>
    </React.Fragment>
  );
};

export default Auth;
