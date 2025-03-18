import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as ImagePicker from 'expo-image-picker'; 
import * as SecureStore from 'expo-secure-store'; 

export default function Profil() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  // State pour stocker les informations de l'utilisateur
  const [user, setUser] = useState({
    NPI: '',
    nomPrenoms: '',
    email: '',
    role: '',
    telephone: ''
  });

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis SecureStore
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            NPI: parsedUser.NPI || '',
            nomPrenoms: `${parsedUser.Firstname} ${parsedUser.Name}` || '',
            email: parsedUser.Email || '',
            role: parsedUser.Role || '',
            telephone: parsedUser.Telephone || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleImageUpload = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Vous devez autoriser l'accès à la galerie pour choisir une image.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setAvatarUri(pickerResult.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setAvatarUri(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon profil</Text>
          <Text style={styles.subtitle}>Gérer mon profil</Text>
        </View>
      </View> 

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImageUpload} style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Icon name="camera-alt" size={40} color="#0a4191" />
          )}
          {avatarUri && (
            <TouchableOpacity onPress={handleRemoveImage} style={styles.deleteButton}>
              <Icon name="delete" size={24} color="orange" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <Text style={styles.idText}>{user.NPI}</Text>
        <Text style={styles.idText}>{user.nomPrenoms}</Text>
      </View>

      <View style={styles.formContainer}>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Email" value={user.email}  
            editable={false} keyboardType="email-address" />   
          <TextInput style={styles.input} placeholder="Numéro" value={user.telephone}
            editable={false} keyboardType="phone-pad" />       
          <TextInput style={styles.input} value={user.role} 
            editable={false} placeholder="Profession" />
          <TextInput style={styles.input} placeholder="Adresse" />
          
          <TouchableOpacity style={styles.button} onPress={() => router.push('/ElevesFolder/Eleves')}>
            <Text style={styles.buttonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOrange} onPress={() => router.push('/MenuFolder/CompleterProfil')}>
            <Text style={styles.buttonText}>Compléter votre profil</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#0a4191',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  idText: {
    marginTop: 5,
    fontSize: 12,
    color: '#282828',
    fontWeight: '500',
    fontFamily: 'Montserrat_400Regular',
  },
  formContainer: {
    marginTop: 15,  
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  form: {
    width: '100%',
    gap: 1, // Espacement uniforme
  },
  input: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 8, // Uniformisation de l'espacement
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Même espacement que les champs
  },
  buttonOrange: {
    height: 45,
    backgroundColor: 'orange',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Même espacement que les champs
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
});
