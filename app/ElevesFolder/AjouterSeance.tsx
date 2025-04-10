import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';  

// Interface pour typer les données des enfants
interface Enfant {
  NPI_enfant: string;
  Nom_enfant: string;
  Prenom_enfant: string;
}

export default function AjouterSeance() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [dateDuJour, setDateDuJour] = useState('');
  const [enfants, setEnfants] = useState<Enfant[]>([]);  
  const [enfantSelectionne, setEnfantSelectionne] = useState<string>('');  
  const [NPI_educateur, setNPI_educateur] = useState<string>('');  
  const [heureSeance, setHeureSeance] = useState('');
  const [observations, setObservations] = useState('');
  const [travailEffectue, setTravailEffectue] = useState('');

  const fetchUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        const parsedUser = JSON.parse(userData); 
        setNPI_educateur(parsedUser.NPI || ''); 
        fetchEnfants(parsedUser.NPI);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données utilisateur.');
    }
  };

  const fetchEnfants = async (NPI: string) => {
    try {
      const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_eleves_assignes/${NPI}`);
      const data = await response.json();

      if (data.status === 200) {
        setEnfants(data.data as Enfant[]);  
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les élèves.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du chargement des données des enfants.');
    }
  };

  // Utiliser useEffect pour récupérer les données à l'initialisation
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    setDateDuJour(formattedDate);

    fetchUserData();
  }, []);

  const generateIdSeance = (referenceTutorat: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // Ajout du zéro devant si nécessaire
    const currentDay = String(now.getDate()).padStart(2, '0'); // Ajout du zéro devant si nécessaire
    
    return `${referenceTutorat}${currentYear}${currentMonth}${currentDay}`;
};

  const generateReferenceTutorat = (npiEnfant: string, npiEducateur: string) => {
    const referenceEnfant = npiEnfant.substring(0, 5);  
    const referenceEducateur = npiEducateur.substring(0, 5);  
    return referenceEnfant + referenceEducateur;
  };

  const handleAddSeance = async () => {
    if (!enfantSelectionne || !heureSeance || !observations || !travailEffectue) {
      Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
      return;
    }

    const referenceTutorat = generateReferenceTutorat(enfantSelectionne, NPI_educateur);
    const idSeance = generateIdSeance(referenceTutorat);

    const dataToSend = {
      Id_seance: idSeance,
      Reference_tutorat: referenceTutorat,
      Heure_seance: heureSeance,
      Observation: observations,
      Travail_effectue: travailEffectue,
      NPI_educateur: NPI_educateur,
      NPI_enfant: enfantSelectionne,
    };

    try {
      // Envoi des données à l'API
      const response = await fetch('https://access-backend-a961a1f4abb2.herokuapp.com/api/add_seance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.error) {
        Alert.alert('Erreur', result.error);
      } else {
        Alert.alert('Succès', 'Séance ajoutée avec succès!');
        router.push('/SeancesFolder/Seances');  
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de la séance.');
    }
  };

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Fiche de séance</Text>
        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={enfantSelectionne}
              onValueChange={(itemValue: string) => setEnfantSelectionne(itemValue)}  
              style={styles.picker}
            >
              <Picker.Item label="Sélectionnez un enfant" value="" />
              {enfants.map((enfant) => (
                <Picker.Item
                  key={enfant.NPI_enfant}
                  label={`${enfant.Nom_enfant} ${enfant.Prenom_enfant}`}
                  value={enfant.NPI_enfant}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.input, isFocused && styles.textAreaFocused]}
            placeholder="Date du jour"
            value={dateDuJour}
            editable={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Heure de travail" 
            value={heureSeance} 
            onChangeText={setHeureSeance}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Observations" 
            value={observations} 
            onChangeText={setObservations}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Travail effectué" 
            multiline={true}
            numberOfLines={3}
            value={travailEffectue} 
            onChangeText={setTravailEffectue}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddSeance}
          >
            <Text style={styles.buttonText}>Ajouter une séance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!fontsLoaded) {
    return <Text>Chargement des polices...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter séance</Text>
          <Text style={styles.subtitle}>Remplir les champs suivants</Text>
        </View>
      </View>
      {renderForm()}
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
  formContainer: {
    marginTop: 24,
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
    gap: 10,
  },
  scrollContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 15,
    overflow: 'hidden', // Pour éviter que la bordure ne dépasse
    marginBottom: 20
  },
  scrollView: {
    maxHeight: 400, // Limite la hauteur de la zone défilable
    marginBottom: 5
  },
  textAreaFocused: {
    borderColor: 'orange',
  },
  input: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
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
    fontFamily: 'Montserrat_700Bold',
  },
  pickerContainer: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden', 
    marginBottom: 5,
  },
  picker: { 
    height: 50, 
    borderColor: '#D1D5DB', 
    borderWidth: 1, 
    borderRadius: 15, 
    paddingHorizontal: 12, 
    marginBottom: 5, 
    fontFamily: 'Montserrat_400Regular', 
    fontSize: 12,
    color: '#282828',
  },
});
