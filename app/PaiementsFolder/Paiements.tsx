import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const paiements = [
  { id: 1, actor: 'M. KOLA Bashorun', enfant: 'Ange Kadoukpè', valeur: '16 heures', statut: 'effectué' },
  { id: 2, actor: 'Famille LISABI', enfant: 'Enfant 2', valeur: '16 heures', statut: 'effectué' },
  { id: 3, actor: 'Famille LALEYE', enfant: '', valeur: '16 heures', statut: 'effectué' },
  { id: 4, actor: 'M. Afolabi Akiwalé', enfant: 'Enfant 2', valeur: '16 heures', statut: 'effectué' },
];

export default function Paiements() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes paiements</Text>
          <Text style={styles.subtitle}>Gérer mes paiements</Text>
        </View>
      </View>

      {paiements.map(p => (
        <View key={p.id} style={styles.paiementCard}>
          <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.paiementImage} />
          <View style={styles.paiementTextContainer}>
            <Text style={styles.paiementTitle}>{p.actor}</Text>
            {p.enfant ? <Text style={styles.paiementDetails}>{`${p.enfant} - ${p.valeur}`}</Text> : null}
            <Text style={styles.paiementStatut}>Paiement {p.statut}</Text>
          </View>
          <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push('/PaiementsFolder/DetailsPaiements')}
          >
              <Icon name="more-vert" size={20} color="#0a4191" />
            </TouchableOpacity>
        </View>
      ))}
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
  paiementCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paiementImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paiementTextContainer: {
    flex: 1,
  },
  paiementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  paiementDetails: {
    fontSize: 10,
    color: '#555',
    fontFamily: 'Montserrat_400Regular',
  },
  paiementStatut: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Montserrat_400Regular',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsIcon: {
    marginRight: 5,
  },
  detailsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
});
