import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons'; 

export default function NavBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/ElevesFolder/Eleves')}>
        <Icon name="people" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/SeancesFolder/Seances')}>
        <Icon name="clipboard" size={30} color="#fff" />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/AccompFolder/Accomps')}>
    <Icon name="hand-left" size={30} color="#fff" />
</TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/PaiementsFolder/Paiements')}>
        <Icon name="wallet" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,  // Distance du bas
    left: 20,    // Distance du côté gauche
    right: 20,   // Distance du côté droit
    flexDirection: 'row',
    justifyContent: 'space-around', // Répartition équitable des icônes
    alignItems: 'center',
    backgroundColor: '#0a4191',  // Couleur bleue
    borderRadius: 15,  // Bord arrondi
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: '#0a4191',  // Couleur bleue pour les boutons
    borderRadius: 15,  // Bord arrondi pour les boutons
    padding: 10,  // Espace autour de l'icône
    justifyContent: 'center',  // Centrer l'icône
    alignItems: 'center',
  },
});
