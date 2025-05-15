import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, usePathname } from 'expo-router'; // Importation de usePathname pour obtenir le chemin actuel
import AppBar from './components/AppBar';
import NavBar from './components/NavBar';

export default function Layout() {
  const pathname = usePathname(); // Récupérer le chemin actuel

  // Liste des pages où l'AppBar et la NavBar ne doivent pas apparaître
  const excludeHeaderPages = ['/Login', '/Register', '/PasswordResetFolder/ResetPassword', '/PasswordResetFolder/CodeChecking','/PasswordResetFolder/ChangePassword', '/'];

  // Vérifier si la page actuelle est dans la liste des pages à exclure
  const showHeader = !excludeHeaderPages.includes(pathname);

  return (
    <View style={styles.container}>
      {showHeader && <AppBar />} {/* Afficher AppBar seulement si showHeader est true */}
      <View style={styles.content}>
        <Slot /> {/* Le contenu de la page actuelle */}
      </View>
      {showHeader && <NavBar />} {/* Afficher NavBar seulement si showHeader est true */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
