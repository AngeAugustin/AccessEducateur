import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; 
import { router, useRouter } from 'expo-router';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';


export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [NPI, setNPI] = useState('');
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [isFocused, setIsFocused] = useState(false); 

  const [error, setError] = useState('');
 
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;  // Ou un indicateur de chargement
  }

  const router = useRouter(); // Assure-toi que c’est bien importé

    const handleLogin = async () => {
    setError('');

    if (!email || !NPI) {
        setError("Veuillez remplir tous les champs.");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        setError("L'adresse email n'est pas valide");
        return;
    }

    try {
        const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Email: email,
            NPI: NPI,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        setError(data.error || 'Une erreur est survenue');
        } else {
        // Navigation vers la page de vérification du code
        router.push(`/PasswordResetFolder/CodeChecking?NPI=${NPI}`)
        }
    } catch (err) {
        setError("Erreur de connexion au serveur.");
        console.error(err);
    }
    };



  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/8PkWZ8ry/rst.png' }}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>Réinitialisation de mot de passe</Text>
          <Text style={styles.subtitle}>
            Veuillez entrer les informations demandées.
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
            placeholder="NPI"
            value={NPI}
            onChangeText={setNPI}
          />

          <View style={styles.AnyContainer}>
            
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Réinitialiser mot de passe</Text>
          </TouchableOpacity>

        </View>

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
  AnyContainer: {
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center'
  },
});
