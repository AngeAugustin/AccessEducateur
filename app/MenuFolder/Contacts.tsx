import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Pour l'icône d'email
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Pour Facebook et WhatsApp
import { useFonts } from 'expo-font';  // Si vous utilisez Expo
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function Contacts() {
  // Fonctions pour ouvrir les liens
  const openMail = () => Linking.openURL('mailto:augustinfachehoun97@gmail.com');
  const openFacebook = () => Linking.openURL('https://www.facebook.com');
  const openWhatsApp = () => Linking.openURL('https://wa.me/22954053660'); // Numéro WhatsApp au format international

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
      <Text style={styles.title}>Contactez-nous</Text>

      {/* Boutons réseaux sociaux */}
      <View style={styles.socialButtonsContainer}>
        {/* Bouton Mail */}
        <TouchableOpacity style={styles.button} onPress={openMail}>
          <Icon name="email" size={24} color="#fff" />
          <Text style={styles.buttonText}>Mail</Text>
        </TouchableOpacity>

        {/* Bouton Facebook */}
        <TouchableOpacity style={styles.button} onPress={openFacebook}>
          <FontAwesome name="facebook" size={24} color="#fff" />
          <Text style={styles.buttonText}>Facebook</Text>
        </TouchableOpacity>

        {/* Bouton WhatsApp */}
        <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
          <FontAwesome name="whatsapp" size={24} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
  },
  socialButtonsContainer: {
    width: '100%',
    alignItems: 'center', // Centrer les boutons horizontalement
    marginTop: 20,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a4191',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 16, // Espacement entre les boutons
    width: '90%', // Prendre 90% de la largeur de l'écran
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'Montserrat_700Bold',
  },
});
