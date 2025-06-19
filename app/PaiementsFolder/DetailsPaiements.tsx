import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

// 🔹 Type pour la réponse API
type PaiementParentDetails = {
  Id_paiement: string;
  Id_transaction: string;
  NPI_agent: string;
  Nom_agent: string;
  Prenom_agent: string;
  Email_agent: string;
  Montant_paiement: string;
  Date_paiement: string;
  Statut_paiement: string;
  Role: string;
};

export default function DetailsPaiements() {
  const router = useRouter();
  const { ID } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const role = 'Admin';  
  const [paiement, setPaiement] = useState<PaiementParentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaiementDetails = async () => {
      try {
        const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/details/paiement/${ID}/${role}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du paiement');
        }
        const data = (await response.json()) as PaiementParentDetails;
        setPaiement(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
        Alert.alert('Erreur', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaiementDetails();
  }, [ID]);

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0a4191" />
      </View>
    );
  }

  if (!paiement) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun détail de paiement trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détails du paiement</Text>
          <Text style={styles.subtitle}>Informations du paiement</Text>
        </View>
      </View>

      {/* Image du paiement */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Informations paiement en lecture seule */}
      <View style={styles.formContainer}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>ID du paiement</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{paiement.Id_paiement}</Text></View>

          <Text style={styles.label}>ID de la transaction</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{paiement.Id_transaction}</Text></View>

          <Text style={styles.label}>Date du paiement</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{paiement.Date_paiement}</Text></View>

          <Text style={styles.label}>Montant payé</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{paiement.Montant_paiement} FCFA</Text></View>
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
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderColor: 'white',
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatar: {
    width: '90%',
    height: '90%',
  },
  formContainer: {
    marginTop: 0,
    flex: 1,
  },
  form: {
    flexGrow: 1,
    gap: 2,
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
