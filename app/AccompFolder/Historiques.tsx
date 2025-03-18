import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Historiques() {
  const router = useRouter();

  // Exemple de données pour le tableau avec des identifiants uniques
  const enfantsData = [
    { id: '1', famille: 'SAANY Loka', date: '15/01/2025' },
    { id: '2', famille: 'LISABI Akala', date: '12/01/2025' },
    { id: '3', famille: 'SAANY Loka', date: '09/01/2025' },
    { id: '4', famille: 'LISABI Akala', date: '06/01/2025' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historique des suivis</Text>
          <Text style={styles.subtitle}>Gérer mes suivis</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/AccompFolder/AjouterSuivi')}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.addText}>Ajouter un suivi</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnEnfant]}>Famille</Text>
          <Text style={[styles.tableHeaderText, styles.columnMatiere]}>Date du jour</Text>
          <Text style={[styles.tableHeaderText, styles.columnDetails]}>Détails</Text>
        </View>

        {enfantsData.map((enfant, index) => (
          <View key={enfant.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.columnEnfant]}>{enfant.famille}</Text>
            <Text style={[styles.tableCell, styles.columnMatiere]}>{enfant.date}</Text>
            <TouchableOpacity 
              style={[styles.detailsButton, styles.columnDetails]}
              onPress={() => router.push(`/AccompFolder/DetailsAccomp`)} 
            >
              <Icon name="info-outline" size={24} color="#0a4191" />
            </TouchableOpacity>
          </View>
        ))}
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
  addButton: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a4191',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  tableContainer: {
    marginTop: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 24,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0a4191',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  detailsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  columnEnfant: {
    flex: 3, // Plus large pour le nom de l'enfant
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnMatiere: {
    flex: 2, // Taille intermédiaire pour la classe
    textAlign: 'center',
  },
  columnDetails: {
    flex: 1, // Plus petit pour le bouton
    textAlign: 'center',
  },
});
