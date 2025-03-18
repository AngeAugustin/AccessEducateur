import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Cette fonction sert à masquer l'AppBar et la NavBar pour cette page spécifique
export const config = {
  screen: {
    headerShown: false, // Cette option désactive l'AppBar (header) pour cette page
  },
};

export default function IndexPage() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/Login')}>
      <Image source={{ uri: 'https://i.postimg.cc/9QvqpzQZ/access-2.png' }} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
