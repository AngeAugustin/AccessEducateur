import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';  // Si vous utilisez Expo
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';


export default function Reclamation() {
  const [isFocused, setIsFocused] = useState(false); // État pour détecter le focus

  const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
      });
    
      if (!fontsLoaded) {
        return <Text>Loading...</Text>;  // Ou un indicateur de chargement
      }

  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={styles.title}>Faire une réclamation</Text>

      {/* Zone de texte */}
      <TextInput
        style={[styles.textArea, isFocused && styles.textAreaFocused]} // Change de style selon l'état
        placeholder="Écrivez votre réclamation ici..."
        placeholderTextColor="#A9A9A9"
        multiline={true}
        numberOfLines={10}
        onFocus={() => setIsFocused(true)} // Passe en focus
        onBlur={() => setIsFocused(false)} // Sort du focus
      />

      {/* Bouton Soumettre */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Soumettre</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 50,
  }, 
  title: {
    fontSize: 16,
    color: '#282828',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
  },
  textArea: {
    width: '100%',
    height: 300, // Hauteur de la zone de texte
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 12,
    textAlignVertical: 'top', // Assure que le texte commence en haut
    color: '#282828',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  textAreaFocused: {
    borderColor: 'orange', // Couleur des bordures lorsqu'on clique dans le champ
  },
  button: {
    height: 45,
    width: '100%',
    backgroundColor: '#0a4191',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
});
