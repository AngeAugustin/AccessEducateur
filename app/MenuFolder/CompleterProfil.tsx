import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';

export default function CompleterProfil() {
  const router = useRouter();
  const [user, setUser] = useState<{ NPI: string }>({ NPI: '' });

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [fileCIP, setFileCIP] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileCasier, setFileCasier] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [formData, setFormData] = useState({
    Experience: '',
    Parcours: '',
    Date_naissance: '',
    Situation_matrimoniale: '',
    Garant_1: '',
    Adresse_garant1: '',
    Garant_2: '',
    Adresse_garant2: '',
    Dispo1: '',
    Dispo2: '',
    Dispo3: '',
    Dispo4: '',
  });

  const pickDocument = async (
    setFile: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (!result.canceled && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ NPI: parsedUser.NPI || '' });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!user.NPI) {
      Alert.alert('Erreur', 'Identifiant utilisateur (NPI) introuvable.');
      return;
    }

    const form = new FormData();
    form.append('NPI', user.NPI);
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));

    if (fileCIP) {
      form.append('Carte_identite', {
        uri: fileCIP.uri,
        name: fileCIP.name,
        type: fileCIP.mimeType,
      } as any);
    }

    if (fileCasier) {
      form.append('Casier_judiciaire', {
        uri: fileCasier.uri,
        name: fileCasier.name,
        type: fileCasier.mimeType,
      } as any);
    }

    try {
      const response = await fetch('https://access-backend-a961a1f4abb2.herokuapp.com/api/complete', {
        method: 'POST',
        body: form,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message);
        router.push('/MenuFolder/Profil');
      } else {
        Alert.alert('Erreur', data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter suivi</Text>
          <Text style={styles.subtitle}>Remplir les champs suivants</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Compléter les informations</Text>

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
          <TextInput 
              style={styles.input} 
              placeholder="Nombres d'années d'expérience"
              onChangeText={(text) => setFormData({ ...formData, Experience: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Parcours"
              onChangeText={(text) => setFormData({ ...formData, Parcours: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Date de naissance"
              onChangeText={(text) => setFormData({ ...formData, Date_naissance: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Situation matrimoniale"
              onChangeText={(text) => setFormData({ ...formData, Situation_matrimoniale: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Informations Garant 1"
              onChangeText={(text) => setFormData({ ...formData, Garant_1: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Adresse Garant 1"
              onChangeText={(text) => setFormData({ ...formData, Adresse_garant1: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Informations Garant 2"
              onChangeText={(text) => setFormData({ ...formData, Garant_2: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Adresse Garant 2"
              onChangeText={(text) => setFormData({ ...formData, Adresse_garant2: text })}
            />
            <View style={styles.fileContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFileCIP)}>
                <Text style={styles.fileButtonText}>Carte d'identité ou CIP</Text>
              </TouchableOpacity>
              {fileCIP && <Text style={styles.fileName}>{fileCIP.name}</Text>}
            </View>
            <View style={styles.fileContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFileCasier)}>
                <Text style={styles.fileButtonText}>Casier Judiciaire</Text>
              </TouchableOpacity>
              {fileCasier && <Text style={styles.fileName}>{fileCasier.name}</Text>}
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Disponibilité 1"
              onChangeText={(text) => setFormData({ ...formData, Dispo1: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Disponibilité 2"
              onChangeText={(text) => setFormData({ ...formData, Dispo2: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Disponibilité 3"
              onChangeText={(text) => setFormData({ ...formData, Dispo3: text })}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Disponibilité 4"
              onChangeText={(text) => setFormData({ ...formData, Dispo4: text })}
            />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
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
  fileContainer: {
    marginBottom: 10,
  },
  fileButton: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fileButtonText: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  fileInfo: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 10,
  },
  fileName: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  removeFile: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
  formScroll: {
    height: 380,
  },
});
