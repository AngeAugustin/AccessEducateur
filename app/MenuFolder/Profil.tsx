import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';

export default function Profil() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const getStatusImage = (status: string): string => {
    switch (status) {
      case 'Nouveau':
        return 'https://i.postimg.cc/hv72xRSf/Nouveau.png';
      case 'Vérifié':
        return 'https://i.postimg.cc/VsVyCzFL/V-rifier.png';
      case 'Rejeté':
        return 'https://i.postimg.cc/rpc7ksqg/Non-V-rifier.png';
      default:
        return ''; // Retourne une chaîne vide au lieu de `null`
    }
  };

  // State pour stocker les informations de l'utilisateur
  const [user, setUser] = useState({
    NPI: '',
    nomPrenoms: '',
    email: '', 
    role: '',
  });

  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [statut, setStatut] = useState('');
  const [matiere, setMatiere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [photoEducateur, setPhotoEducateur] = useState('');

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
          });
          fetchUserProfile(parsedUser.NPI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  // Fonction pour récupérer le profil utilisateur depuis l'API
  const fetchUserProfile = async (NPI: string) => {
    try {
      const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/profil/${NPI}`); 

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil utilisateur');
      }

      const data = await response.json();
      setTelephone(data.Telephone || '');
      setAdresse(data.Adresse || '');
      setStatut(data.Statut_profil || '');
      setMatiere(data.Matiere || ''); // Récupérer la matière
      setNiveau(data.Niveau || ''); // Récupérer le niveau
      setPhotoEducateur(data.Photo_educateur || ''); // Récupérer la photo de l'éducateur
    } catch (error) {
      console.error('Erreur API:', error);
    }
  };

  // Fonction pour envoyer les modifications au backend
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/modif/${user.NPI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Telephone: telephone,
          Adresse: adresse,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des informations');
      }

      const data = await response.json();
      Alert.alert('Succès', data.message);
    } catch (error) {
      console.error('Erreur API:', error);
      Alert.alert('Erreur', 'Il y a eu un problème lors de la mise à jour de votre profil.');
    }
  };

  // Fonction pour convertir la chaîne base64 en URL d'image
  const convertBase64ToImage = (base64String: string) => {
    return `data:image/jpeg;base64,${base64String}`;  // S'assurer que le type de l'image est correct, ici 'jpeg'
  };

  // Met à jour le niveau en fonction de sa valeur
  const getProfessionByNiveau = (niveau: string) => {
    if (niveau === 'Cycle I') {
      return 'Professeur(e) Adjoint(e)';
    } else if (niveau === 'Cycle II') {
      return 'Professeur(e) Certifié(e)';
    }
    return niveau; // retourne la valeur par défaut si le niveau n'est ni "Cycle I" ni "Cycle II"
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
        <View style={styles.avatarWrapper}>
          {photoEducateur ? (
            <Image source={{ uri: convertBase64ToImage(photoEducateur) }} style={styles.avatar} />
          ) : (
            <Icon name="account-circle" size={40} color="#0a4191" />
          )}
        </View>

        <Text style={styles.idText}>{user.NPI || ''}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.idText}>{user.nomPrenoms || ''}</Text>
          {getStatusImage(statut) !== '' && (
            <Image 
              source={{ uri: getStatusImage(statut) }} 
              style={styles.statusImage} 
            />
          )}
        </View>
        <Text style={styles.idText}>{`${getProfessionByNiveau(niveau) || ''} en ${matiere || ''}`}</Text> 
      </View>

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Email" value={user.email || ''}  
            editable={false} keyboardType="email-address" />   
          <TextInput style={styles.input} placeholder="Numéro de téléphone" 
            value={telephone} onChangeText={setTelephone} />       
          <TextInput style={styles.input} value={user.role || ''} 
            editable={false} placeholder="Profession"  />
          <TextInput style={styles.input} placeholder="Adresse" value={adresse} onChangeText={setAdresse} />
          
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>

          {statut !== 'Vérifié' && (
            <TouchableOpacity style={styles.buttonOrange} onPress={() => router.push('/MenuFolder/CompleterProfil')}>
              <Text style={styles.buttonText}>Compléter votre profil</Text>
            </TouchableOpacity>
          )}

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
  form: {
    width: '100%',
    gap: 1, 
  },
  input: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 8,
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonOrange: {
    height: 45,
    backgroundColor: 'orange',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
