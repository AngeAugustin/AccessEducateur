import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function CompleterProfil() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [fileCIP, setFileCIP] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileCasier, setFileCasier] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
  const maxFileSize = 5 * 1024 * 1024; // 5Mo

  const pickDocument = async (
    setFile: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (!result.canceled && result.assets.length > 0) {
      const selectedFile = result.assets[0];

      if (!allowedFileTypes.includes(selectedFile.mimeType || '')) {
        Alert.alert('Format invalide', 'Veuillez sélectionner un fichier PNG, JPEG, WEBP ou PDF.');
        return;
      }

      if (selectedFile.size && selectedFile.size > maxFileSize) {
        Alert.alert('Taille trop grande', 'Le fichier ne doit pas dépasser 5 Mo.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const renderFilePicker = (
    label: string,
    file: DocumentPicker.DocumentPickerAsset | null,
    setFile: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => (
    <View style={styles.fileContainer}>
      <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFile)}>
        <Text style={styles.fileButtonText}>{label}</Text>
      </TouchableOpacity>
      {file && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name} ({(file.size! / 1024).toFixed(2)} KB)</Text>
          <TouchableOpacity onPress={() => setFile(null)}>
            <Text style={styles.removeFile}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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
            <TextInput style={styles.input} placeholder="Date de naissance" />
            <TextInput style={styles.input} placeholder="Situation matrimoniale" />
            <TextInput style={styles.input} placeholder="Informations Garant 1" />
            <TextInput style={styles.input} placeholder="Adresse Garant 1" />
            <TextInput style={styles.input} placeholder="Informations Garant 2" />
            <TextInput style={styles.input} placeholder="Adresse Garant 2" />
            {renderFilePicker("Carte d'identité ou CIP", fileCIP, setFileCIP)}
            {renderFilePicker("Casier Judiciaire", fileCasier, setFileCasier)}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/MenuFolder/Profil')}>
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
