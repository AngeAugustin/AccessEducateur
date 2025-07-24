import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
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
  const [filePhoto, setFilePhoto] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileAcademique, setFileAcademique] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileProfessionnel, setFileProfessionnel] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [formData, setFormData] = useState({
    Experience: '',
    Parcours: '',
    Date_naissance: '',
    Situation_matrimoniale: '',
    Garant_1: '',
    Adresse_garant1: '',
    Garant_2: '',
    Adresse_garant2: '',
    // Données pour l'API
    Dispo1_jour: '',
    Dispo1_heure: '',
    Dispo2_jour: '',
    Dispo2_heure: '',
    Dispo3_jour: '',
    Dispo3_heure: '',
    Dispo4_jour: '',
    Dispo4_heure: '',
  });

  // États pour les disponibilités affichées
  const [disponibilites, setDisponibilites] = useState({
    Dispo1: '',
    Dispo2: '',
    Dispo3: '',
    Dispo4: '',
  });

  // États pour les modales
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDispoField, setCurrentDispoField] = useState('');
  const [currentStep, setCurrentStep] = useState<'jour' | 'heure'>('jour');
  const [selectedDay, setSelectedDay] = useState('');

  // États pour le sélecteur de date personnalisé
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateText, setDateText] = useState('');
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1);
  const [tempDay, setTempDay] = useState(new Date().getDate());
  const [dateStep, setDateStep] = useState<'year' | 'month' | 'day'>('year');

  // Données statiques
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  const generateHeures = () => {
    const heures = [];
    for (let i = 6; i <= 20; i++) { // De 06h à 20h pour permettre des créneaux de 3h jusqu'à 23h
      const heure = i.toString().padStart(2, '0');
      const heureFin = (i + 3).toString().padStart(2, '0');
      heures.push(`${heure}h-${heureFin}h`);
    }
    return heures;
  };

  const heures = generateHeures();

  // Données pour le sélecteur de date
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 70; i <= currentYear; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  const years = generateYears();
  const months = [
    { number: 1, name: 'Janvier' },
    { number: 2, name: 'Février' },
    { number: 3, name: 'Mars' },
    { number: 4, name: 'Avril' },
    { number: 5, name: 'Mai' },
    { number: 6, name: 'Juin' },
    { number: 7, name: 'Juillet' },
    { number: 8, name: 'Août' },
    { number: 9, name: 'Septembre' },
    { number: 10, name: 'Octobre' },
    { number: 11, name: 'Novembre' },
    { number: 12, name: 'Décembre' },
  ];

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

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

  // Fonction pour ouvrir le sélecteur de disponibilité
  const openDispoSelector = (dispoField: string) => {
    setCurrentDispoField(dispoField);
    setCurrentStep('jour');
    setSelectedDay('');
    setModalVisible(true);
  };

  // Fonction pour sélectionner un jour de la semaine (disponibilités)
  const selectWeekDay = (jour: string) => {
    setSelectedDay(jour);
    setCurrentStep('heure');
  };

  // Fonction pour sélectionner une heure et finaliser la disponibilité
  const selectHeure = (heure: string) => {
    const disponibiliteComplete = `${selectedDay} ${heure}`;
    
    // Mettre à jour les données pour l'affichage
    setDisponibilites(prev => ({
      ...prev,
      [currentDispoField]: disponibiliteComplete
    }));

    // Mettre à jour les données pour l'API
    const jourField = `${currentDispoField}_jour` as keyof typeof formData;
    const heureField = `${currentDispoField}_heure` as keyof typeof formData;
    
    setFormData(prev => ({
      ...prev,
      [jourField]: selectedDay,
      [heureField]: heure
    }));

    setModalVisible(false);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setModalVisible(false);
    setCurrentStep('jour');
    setSelectedDay('');
  };

  // Fonctions pour gérer le sélecteur de date personnalisé
  const showDatePickerModal = () => {
    setShowDateModal(true);
    setDateStep('year');
  };

  const selectYear = (year: number) => {
    setTempYear(year);
    setDateStep('month');
  };

  const selectMonth = (month: number) => {
    setTempMonth(month);
    setDateStep('day');
  };

  const selectDay = (day: number) => {
    setTempDay(day);
    const formattedDate = `${day.toString().padStart(2, '0')}/${tempMonth.toString().padStart(2, '0')}/${tempYear}`;
    setDateText(formattedDate);
    setFormData({ ...formData, Date_naissance: formattedDate });
    setShowDateModal(false);
  };

  const closeDateModal = () => {
    setShowDateModal(false);
    setDateStep('year');
  };

  const handleSubmit = async () => {
    if (!user.NPI) {
      Alert.alert('Erreur', 'Identifiant utilisateur (NPI) introuvable.');
      return;
    }

    const form = new FormData();
    form.append('NPI', user.NPI);
    
    // Ajouter les données du formulaire
    Object.entries(formData).forEach(([key, value]) => {
      if (value) { // Seulement ajouter les valeurs non vides
        form.append(key, value);
      }
    });

    // Ajouter les fichiers
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

    if (filePhoto) {
      form.append('Photo_educateur', {
        uri: filePhoto.uri,
        name: filePhoto.name,
        type: filePhoto.mimeType,
      } as any);
    }

    if (fileAcademique) {
      form.append('Diplome_academique', {
        uri: fileAcademique.uri,
        name: fileAcademique.name,
        type: fileAcademique.mimeType,
      } as any);
    }

    if (fileProfessionnel) {
      form.append('Diplome_professionnel', {
        uri: fileProfessionnel.uri,
        name: fileProfessionnel.name,
        type: fileProfessionnel.mimeType,
      } as any);
    }

    try {
      const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/complete', {
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
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={showDatePickerModal}
            >
              <Text style={styles.dateButtonText}>
                {dateText || "Date de naissance"}
              </Text>
            </TouchableOpacity>
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
            <View style={styles.fileContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFilePhoto)}>
                <Text style={styles.fileButtonText}>Photo d'identité</Text>
              </TouchableOpacity>
              {filePhoto && <Text style={styles.fileName}>{filePhoto.name}</Text>}
            </View>
            <View style={styles.fileContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFileAcademique)}>
                <Text style={styles.fileButtonText}>Dernier diplôme académique</Text>
              </TouchableOpacity>
              {fileAcademique && <Text style={styles.fileName}>{fileAcademique.name}</Text>}
            </View>
            <View style={styles.fileContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setFileProfessionnel)}>
                <Text style={styles.fileButtonText}>Dernier diplôme professionnel</Text>
              </TouchableOpacity>
              {fileProfessionnel && <Text style={styles.fileName}>{fileProfessionnel.name}</Text>}
            </View>
            <TouchableOpacity 
              style={styles.dispoButton} 
              onPress={() => openDispoSelector('Dispo1')}
            >
              <Text style={styles.dispoButtonText}>
                {disponibilites.Dispo1 || "Disponibilité 1"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dispoButton} 
              onPress={() => openDispoSelector('Dispo2')}
            >
              <Text style={styles.dispoButtonText}>
                {disponibilites.Dispo2 || "Disponibilité 2"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dispoButton} 
              onPress={() => openDispoSelector('Dispo3')}
            >
              <Text style={styles.dispoButtonText}>
                {disponibilites.Dispo3 || "Disponibilité 3"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dispoButton} 
              onPress={() => openDispoSelector('Dispo4')}
            >
              <Text style={styles.dispoButtonText}>
                {disponibilites.Dispo4 || "Disponibilité 4"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>

      {/* Modale pour sélectionner la date */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateModal}
        onRequestClose={closeDateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {dateStep === 'year' ? 'Sélectionner une année' : 
                 dateStep === 'month' ? 'Sélectionner un mois' : 'Sélectionner un jour'}
              </Text>
              <TouchableOpacity onPress={closeDateModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
              {dateStep === 'year' && years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.modalItem}
                  onPress={() => selectYear(year)}
                >
                  <Text style={styles.modalItemText}>{year}</Text>
                </TouchableOpacity>
              ))}

              {dateStep === 'month' && months.map((month) => (
                <TouchableOpacity
                  key={month.number}
                  style={styles.modalItem}
                  onPress={() => selectMonth(month.number)}
                >
                  <Text style={styles.modalItemText}>{month.name}</Text>
                </TouchableOpacity>
              ))}

              {dateStep === 'day' && generateDays(tempYear, tempMonth).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={styles.modalItem}
                  onPress={() => selectDay(day)}
                >
                  <Text style={styles.modalItemText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modale pour sélectionner les disponibilités */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentStep === 'jour' ? 'Sélectionner un jour' : 'Sélectionner un horaire'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentStep === 'jour' ? jours : heures}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    if (currentStep === 'jour') {
                      selectWeekDay(item);
                    } else {
                      selectHeure(item);
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  dispoButton: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#F8F9FA',
  },
  dispoButtonText: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  dateButton: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#F8F9FA',
  },
  dateButtonText: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalItemText: {
    fontSize: 14,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  dateScrollView: {
    maxHeight: 300,
  },
});
