import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; 

// Définition du type 
interface Paiement {
  Id_paiement: string;
  Parent_nom: string;
  Parent_prenom : string;
  Montant_paiement: string;
  Statut_paiement: string;
  Date_paiement: string;
}

export default function Paiements() {
  const router = useRouter();
  const [user, setUser] = useState<{ NPI: string }>({ NPI: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [paiements, setPaiements] = useState<Paiement[]>([]);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await SecureStore.getItemAsync('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser({ NPI: parsedUser.NPI || '' });
  
            // Appeler l'API avec le NPI récupéré
            fetchPaiements(parsedUser.NPI);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur', error);
        }
      };
  
      fetchUserData();
    }, []);

    const fetchPaiements = async (NPI: string) => {
        try {
          const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/paiements_educateur/${NPI}`);
          const data = await response.json();
    
          if (response.ok) {
            setPaiements(data as Paiement[]);
          } else {
            setPaiements([]);
          }

        } catch (error) {
          console.error('Erreur lors de la récupération des enfants:', error);
        } finally {
          setLoading(false);
        }
      };
    
      if (loading) {
        return (
          <View style={styles.container}>
            <Text>Chargement...</Text>
          </View>
        );
      }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes paiements</Text>
          <Text style={styles.subtitle}>Gérer mes paiements</Text>
        </View>
      </View>

      {paiements.length > 0 ? (paiements.map(p => (
        <View key={p.Id_paiement} style={styles.paiementCard}>
          <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.paiementImage} />
          <View style={styles.paiementTextContainer}>
            <Text style={styles.paiementTitle}>{p.Parent_nom} {p.Parent_prenom}</Text>
            <Text style={styles.paiementDetails}>{`${p.Montant_paiement}`}</Text>
            <Text style={styles.paiementStatut}>Paiement {p.Statut_paiement}</Text>
          </View>
          <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push(`/PaiementsFolder/DetailsPaiements?Id_paiement=${p.Id_paiement}`)} 
          >
              <Icon name="more-vert" size={20} color="#0a4191" />
            </TouchableOpacity>
        </View>
      ))
      ) : (
          <Text style={styles.noDataText}>Aucun paiement trouvé</Text>
     )}
              
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
  noDataText: {
    textAlign: 'center',
    color: '#282828',
    marginTop: 20,
  },
});
