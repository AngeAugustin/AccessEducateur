import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const profileImageUrl = 'https://i.postimg.cc/9FqSnKGz/Accueil.jpg';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({ nomPrenoms: '', npi: '' });
  const [seances, setSeances] = useState([]);
  const [loadingSeances, setLoadingSeances] = useState(true);
  const [eleveCount, setEleveCount] = useState<number | null>(null);
  const [seanceCount, setSeanceCount] = useState<number | null>(null);
  const [photoProfilBase64, setPhotoProfilBase64] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDataAndSeances = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const npi = parsedUser.NPI || '';
          setUser({
            npi,
            nomPrenoms: `${parsedUser.Firstname} ${parsedUser.Name}` || '',
          });

          // Appel API pour les séances récentes
          const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/seances_recentes/${npi}`);
          const data = await response.json();
          setSeances(data);

          // Appel API pour compter les élèves
          const elevesRes = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/count_eleves/${npi}`);
          const elevesData = await elevesRes.json();
          setEleveCount(elevesData.eleves_uniques);

          // Appel API pour compter les séances
          const seancesRes = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/count_seances/${npi}`);
          const seancesData = await seancesRes.json();
          setSeanceCount(seancesData.seances_uniques);

          // Récupérer la photo de l'éducateur
          const filesResponse = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/get-all-files/${npi}`);
          const filesData = await filesResponse.json();

          if (filesData?.files?.Photo_educateur) {
            setPhotoProfilBase64(`data:image/jpeg;base64,${filesData.files.Photo_educateur}`);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      } finally {
        setLoadingSeances(false);
      }
    };

    fetchUserDataAndSeances();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* HEADER */}
          <View style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Salut,</Text>
                <Text style={styles.username}>{user.nomPrenoms}</Text>
              </View>
              {/* Affichage de la photo de profil récupérée ou fallback */}
              <Image
                source={{ uri: photoProfilBase64 || profileImageUrl }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.dashboardDivider} />

            <Text style={styles.dashboardTitle}>Tableau de bord</Text>

            <View style={styles.tilesContainer}>
              <TouchableOpacity style={styles.tile} onPress={() => router.push('/ElevesFolder/Eleves')}>
                <View style={styles.tileContent}>
                  <View>
                    <Text style={styles.tileLabel}>Mes élèves</Text>
                    <View style={styles.tileNumberRow}>
                      <Text style={styles.tileNumber}>{eleveCount !== null ? eleveCount : '...'}</Text>
                      <Feather name="arrow-up-right" size={18} color="#1E40AF" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                  <View style={styles.tileIconContainer}>
                    <View style={styles.circleIcon}>
                      <Feather name="users" size={16} color="#FFC107" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tile} onPress={() => router.push('/SeancesFolder/Seances')}>
                <View style={styles.tileContent}>
                  <View>
                    <Text style={styles.tileLabel}>Mes séances</Text>
                    <View style={styles.tileNumberRow}>
                      <Text style={styles.tileNumber}>{seanceCount !== null ? seanceCount : '...'}</Text>
                      <Feather name="arrow-up-right" size={18} color="#1E40AF" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                  <View style={styles.tileIconContainer}>
                    <View style={styles.circleIcon}>
                      <Feather name="clock" size={16} color="#FFC107" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION SÉANCES */}
          <View style={styles.seanceSection}>
            <Text style={styles.seanceSectionTitle}>Séances récentes</Text>

            {loadingSeances ? (
              <ActivityIndicator size="small" color="#0A4191" />
            ) : seances.length === 0 ? (
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 12, color: '#888' }}>
                Aucune séance récente trouvée.
              </Text>
            ) : (
              seances.map((seance: any) => (
                <View key={seance.Id_seance} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: 'https://i.postimg.cc/KcTc1zVX/Seance.jpg' }}
                      style={styles.avatar}
                    />
                    <View style={styles.info}>
                      <Text style={styles.date}>{`Séance du ${seance.Date_seance}`}</Text>
                      <Text style={styles.name}>{`${seance.Nom_enfant} ${seance.Prenom_enfant}`}</Text>
                      <Text style={styles.horaire}>{seance.Heure_seance}</Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() =>
                        router.push(`/SeancesFolder/DetailsSeance?Id_seance=${seance.Id_seance}`)
                      }
                    >
                      <Feather name="info" size={20} color="#0A4191" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E40AF' },
  headerBackground: {
    backgroundColor: '#0a4191',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  headerTextContainer: { flex: 1 },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular',
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  dashboardDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 1,
    fontFamily: 'Montserrat_700Bold',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 16,
  },
  tile: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tileContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  tileNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileNumber: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  tileIconContainer: { justifyContent: 'flex-start' },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seanceSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  seanceSectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 60,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EEE',
  },
  info: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
  name: {
    fontSize: 10,
    color: '#7F7F7F',
    fontFamily: 'Montserrat_400Regular',
  },
  horaire: {
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
  },
  buttonContainer: { justifyContent: 'flex-end', alignItems: 'center' },
  infoButton: {
    backgroundColor: 'rgba(15, 87, 174, 0.1)',
    padding: 10,
    borderRadius: 12,
  },
});

export default Dashboard;
