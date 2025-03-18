import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function AjouterSeance() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [isFocused, setIsFocused] = useState(false); // État pour détecter le focus
  const [dateDuJour, setDateDuJour] = useState(''); // État pour stocker la date du jour

  // Utilisation de useEffect pour définir la date du jour formatée au chargement du composant
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR'); // Format français : DD/MM/YYYY
    setDateDuJour(formattedDate);
  }, []);

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Fiche de séance</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enfant concerné"
          />
          <TextInput
            style={[styles.input, isFocused && styles.textAreaFocused]}
            placeholder="Date du jour"
            value={dateDuJour}  // Affiche la date du jour
            editable={false}  // Empêche la modification
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TextInput
            style={styles.input}
            placeholder="Heure de travail"
          />
          <TextInput style={styles.input} placeholder="Observations" />
          <TextInput style={styles.input} 
            placeholder="Travail effectué" 
            multiline={true}
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/ElevesFolder/Eleves')}
          >
            <Text style={styles.buttonText}>Ajouter une séance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
});
