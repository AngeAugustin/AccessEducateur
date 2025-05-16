import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; 
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function ChangePassword() {
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const { NPI } = useLocalSearchParams();

  const [isFocused, setIsFocused] = useState(false); 

  const [error, setError] = useState('');
 
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;  // Ou un indicateur de chargement
  }

  const router = useRouter(); // Assure-toi que c’est bien importé

  const handleChange = async () => {
  setError('');

  if (!confirmPassword || !Password) {
    setError("Veuillez remplir tous les champs.");
    return;
  }

  if (Password !== confirmPassword) {
    setError('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        NPI,
        Password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Une erreur est survenue.');
      return;
    }

    // Navigation ou message de succès
    alert('Mot de passe mis à jour avec succès.');
    router.push('/Login'); // redirige l'utilisateur si tu veux
  } catch (error) {
    console.error(error);
    setError('Erreur réseau. Veuillez réessayer.');
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
          <Text style={styles.title}>Changement du mot de passe</Text>
          <Text style={styles.subtitle}>
            Veuillez entrer le nouveau mot de passe.
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, isFocused && styles.textAreaFocused]}
            placeholder="Mot de passe"
            keyboardType="default"
            value={Password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.AnyContainer}>
            
          </View>

          <TouchableOpacity style={styles.button} onPress={handleChange}>
            <Text style={styles.buttonText}>Changer le mot de passe</Text>
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
