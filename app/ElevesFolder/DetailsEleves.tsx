import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Déclaration du type des détails de l'élève
interface EleveDetails {
  NPI_enfant: string;
  Duree_tutorat: string;
  Observation_generale: string;
  Nom_enfant: string;
  Prenom_enfant: string;
  Classe_actuelle: string;
  Ecole_actuelle: string;
  Adresse: string;
}

export default function DetailsEleves() {
  const router = useRouter();
  const { NPI_enfant } = useLocalSearchParams(); 

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  // Déclaration de l'état avec le type explicite pour éviter l'erreur
  const [details, setDetails] = useState<EleveDetails | null>(null);

  // Fonction pour récupérer les détails de l'élève depuis l'API
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_details_eleves_assignes/${NPI_enfant}`);
        const data = await response.json();

        // Si les détails sont trouvés, on les met dans l'état
        if (data.status === 200) {
          setDetails(data.data[0]);
        } else {
          console.error('Aucun détail trouvé pour cet élève.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      }
    };

    if (NPI_enfant) {
      fetchDetails();
    }
  }, [NPI_enfant]);

  // Si les polices ne sont pas encore chargées ou si les détails ne sont pas encore récupérés
  if (!fontsLoaded || !details) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détails de l'élève</Text>
          <Text style={styles.subtitle}>Quelques informations</Text>
        </View>
      </View>

      {/* Avatar et informations utilisateur */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: 'https://i.postimg.cc/k4MRhY0L/El-ve.png' }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.nameText}><Text style={styles.boldText}>{details.Nom_enfant} {details.Prenom_enfant}</Text></Text>
        <Text style={styles.professionText}>{details.Classe_actuelle}</Text>
        <Text style={styles.professionText}>{details.Ecole_actuelle}</Text>
      </View>

      {/* Informations utilisateur en lecture seule */}
      <View style={styles.formContainer}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

          <Text style={styles.label}>Durée</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Duree_tutorat}</Text></View>

          <Text style={styles.label}>Observation générale</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Observation_generale}</Text></View>

          <Text style={styles.label}>Adresse</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Adresse}</Text></View>
        </ScrollView>

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
    textAlign: 'left',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 5,
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
  nameText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#282828',
  },
  boldText: {
    fontWeight: 'bold',
  },
  professionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#7F7F7F',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  star: {
    color: '#FFD700',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#282828',
  },
  formContainer: {
    marginTop: 10,
    flex: 1,
  },
  form: {
    flexGrow: 1,
    gap: 5,
  },
  label: {
    fontSize: 12,
    color: '#7F7F7F',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 5,
  },
  inputReadonly: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
  },
  inputText: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },

});
