import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; 
import { router, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';


export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [isFocused, setIsFocused] = useState(false); 

  const [error, setError] = useState('');
 
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;  // Ou un indicateur de chargement
  }

  const handleLogin = async () => {

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Expression régulière pour un email valide
    if (!emailPattern.test(email)) {
      setError('L\'adresse email n\'est pas valide');
      return;
    }
    
    try {
      const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/AccessBackend/public/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Role: 'EDUCATEUR',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocke les données utilisateur de manière sécurisée dans SecureStore
        await SecureStore.setItemAsync('user', JSON.stringify({
          Username: data.Username,
          Name: data.Name,
          Firstname: data.Firstname,
          Email: data.Email,
          Role: data.Role,
          NPI: data.NPI,
        }));

        // Redirige vers la page suivante
        router.push('/ElevesFolder/Eleves');
      } else {
        // Vérification de la structure de l'erreur et affichage des messages
        if (data.errors) {
          // Si le backend renvoie un objet avec des erreurs
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);  // Concatène les messages d'erreur
        } else {
          setError(data.error || 'Informations incorrectes');
        }
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion, veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/9QvqpzQZ/access-2.png' }}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>Salut à nouveau !</Text>
          <Text style={styles.subtitle}>
            Veuillez entrer vos informations de connexion.
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, isFocused && styles.textAreaFocused]}
            placeholder="Email"
            keyboardType="email-address"
            onFocus={() => setIsFocused(true)} // Passe en focus
            onBlur={() => setIsFocused(false)} // Sort du focus
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.signUpText}>
          Vous n’avez pas de compte ?{' '}
          <TouchableOpacity onPress={() => router.push('/Register')}>
            <Text style={styles.signUpLink}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontFamily: 'Montserrat_400Regular',  // Applique Montserrat ici
  },
  card: {
    width: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 110,  // Ajustez la taille de l'icône si nécessaire
    height: 110,
    resizeMode: 'contain', // Assurez-vous que l'image est bien contenue dans l'espace
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold', // Applique Montserrat en gras ici
    marginBottom: 10, // Ajout d'un espace sous le titre
  },
  subtitle: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular', // Applique Montserrat normale ici
    marginTop: 5, // Ajout d'un espace au-dessus du sous-titre
  },
  form: {
    width: '90%',
    gap: 5,
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular', // Applique Montserrat normale aux champs de texte
  },
  textAreaFocused: {
    borderColor: 'orange', // Couleur des bordures lorsqu'on clique dans le champ
  },
  forgotPasswordContainer: {
    alignItems: 'center',  // Centre le bouton
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#0a4191',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular', // Applique Montserrat normale ici
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',  // Applique Montserrat gras pour le texte du bouton
  },
  signUpText: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',  // Applique Montserrat normale ici
  },
  signUpLink: {
    color: '#0a4191',
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold', // Applique Montserrat gras ici
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center'
  },
});
