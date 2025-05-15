import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CodeChecking() {
  const router = useRouter();
  const [Code_secret, setCodeSecret] = useState('');
  const [error, setError] = useState('');
  const { NPI } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleLogin = async () => {
    setError('');

    if (!Code_secret) {
      setError("Veuillez remplir le champ OTP.");
      return;
    }

    try {
      const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/check-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NPI, Code_secret }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Erreur inconnue.');
      } else {
        // Succès : redirection ou message
        router.push(`/PasswordResetFolder/ChangePassword?NPI=${NPI}`) // Change cette route selon ton app
      }
    } catch (err) {
      setError('Erreur réseau ou serveur.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/8PkWZ8ry/rst.png' }}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>Saisie OTP</Text>
          <Text style={styles.subtitle}>
            Veuillez entrer le code OTP reçu par email.
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Code secret"
            value={Code_secret}
            onChangeText={setCodeSecret}
          />

          <View style={styles.AnyContainer}></View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  card: {
    width: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  form: {
    width: '90%',
    gap: 5,
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  AnyContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
