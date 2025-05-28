import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Reclamation() {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMotif, setSelectedMotif] = useState('');
  const [reclamationText, setReclamationText] = useState('');
  const [user, setUser] = useState({
    NPI: '',
    nom: '',
    prenom: '',
    email: '',
    role: '',
  });
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            NPI: parsedUser.NPI || '',
            nom: parsedUser.Name || '',
            prenom: parsedUser.Firstname || '',
            email: parsedUser.Email || '',
            role: parsedUser.Role || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  const generateRandom10Digits = () => {
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10); // chiffre entre 0 et 9
  }
  return result;
};

const random10Digits = generateRandom10Digits();
console.log(random10Digits);  // ex: "4839201756"

  const generateID = (npiEnfant: string, npiEducateur: string) => {
    const referenceEnfant = npiEnfant.substring(0, 5);  
    const referenceEducateur = npiEducateur.substring(0, 5);  
    return referenceEnfant + referenceEducateur;
  };

  const handleSubmit = async () => {
    if (!selectedMotif || !reclamationText.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const payload = {
      Id_reclamation: random10Digits,
      NPI_demandant: user.NPI,
      Motif: selectedMotif,
      Details: reclamationText,
      Mail_demandant: user.email,
      Nom_demandant: user.nom,
      Prenom_demandant: user.prenom,
      Role_demandant: user.role,
    };

    try {
      const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/add_reclamation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
              Alert.alert('Erreur', data.error);
            } else {
              Alert.alert('Succès', 'Réclamation faite avec succès!');
              router.push('/Accueil');  
            }
    } catch (error) {
      console.error('Erreur API :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Réclamation</Text>
          <Text style={styles.subtitle}>Remplir le formulaire</Text>
        </View>
      </View>

      <Text style={styles.Formtitle}>Formulaire de réclamation</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedMotif}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMotif(itemValue)}
        >
          <Picker.Item label="Sélectionnez un motif" value="" />
          <Picker.Item label="Plainte professeur" value="professeur" />
          <Picker.Item label="Plainte paiement" value="paiement" />
          <Picker.Item label="Autres" value="autres" />
        </Picker>
      </View>

      <TextInput
        style={[styles.textArea, isFocused && styles.textAreaFocused]}
        placeholder="Écrivez votre réclamation ici..."
        placeholderTextColor="#A9A9A9"
        multiline={true}
        numberOfLines={5}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={reclamationText}
        onChangeText={setReclamationText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Soumettre</Text>
      </TouchableOpacity>
    </View>
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
    textAlign: 'left',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  Formtitle: {
    fontSize: 14,
    color: '#282828',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
    marginTop: 15,
  },
  pickerWrapper: {
    width: '100%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#282828',
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
  },
  textArea: {
    width: '100%',
    height: 300,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 12,
    textAlignVertical: 'top',
    color: '#282828',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  textAreaFocused: {
    borderColor: 'orange',
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
