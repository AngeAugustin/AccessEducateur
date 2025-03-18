import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';  // Si vous utilisez Expo
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

// Type pour les routes valides dans l'application
type MenuRoute = "/MenuFolder/Profil" | "/MenuFolder/Contacts" | "/MenuFolder/Conditions" | "/MenuFolder/Reclamations" | "/MenuFolder/Notifications";

interface MenuItem {
  icon: string;
  text: string;
  route: MenuRoute; // Utilisation du type MenuRoute pour garantir des routes valides
}

const AppBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter(); 

  const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
      });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View>
      {/* Barre d'application */}
      <View style={styles.container}>
        <Image source={{ uri: 'https://i.postimg.cc/9QvqpzQZ/access-2.png' }} style={styles.logo} />
        <Text style={styles.title}>AcCes Educateurs</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="menu" size={30} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu}>
          <View style={styles.menu}>
            {/* Boucle à travers les éléments du menu */}
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu(); // Ferme le menu
                  router.push(item.route); // Navigue vers la route correspondante
                }}
              >
                <Icon name={item.icon} size={20} color="#0a4191" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Liste des éléments du menu avec des routes définies et typées
const menuItems: MenuItem[] = [
  { icon: 'person', text: 'Profil', route: '/MenuFolder/Profil' },
  { icon: 'notifications', text: 'Notifications', route: '/MenuFolder/Notifications' },
  { icon: 'call', text: 'Contactez-nous', route: '/MenuFolder/Contacts' },
  { icon: 'document-text', text: 'Conditions générales d\'utilisation', route: '/MenuFolder/Conditions' },
  { icon: 'alert-circle', text: 'Faire une réclamation', route: '/MenuFolder/Reclamations' },
];

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    color: '#0a4191',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuIcon: {
    color: '#0a4191',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: '#282828',
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold', 
  },
});

export default AppBar;
