import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function DetailsPaiements() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détails du paiement</Text>
          <Text style={styles.subtitle}>Informations du paiement</Text>
        </View>
      </View>

      {/* Paiemtns details */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Informations paiement en lecture seule */}
      <View style={styles.formContainer}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

          <Text style={styles.label}>ID du paiement</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>364485683454</Text></View>

          <Text style={styles.label}>Emmetteur</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>Famille LISABI</Text></View>

          <Text style={styles.label}>Intitulé du paiement</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>Mois de Août 2024</Text></View>

          <Text style={styles.label}>Montant payé</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>17820 FCFA</Text></View>

          <Text style={styles.label}>Moyen de paiement</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>MTN Mobile Money</Text></View>

          <TouchableOpacity
            style={styles.button}  
            >
            <Text style={styles.buttonText}>Imprimer</Text>
          </TouchableOpacity>
          
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
});
