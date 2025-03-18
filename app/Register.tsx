import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; 
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';

// Définir le type pour formData
interface FormData {
  NPI: string;
  Name: string;
  Firstname: string;
  Telephone: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

export default function RegisterPage() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular, 
    Montserrat_700Bold,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    NPI: '',
    Name: '',
    Firstname: '',
    Telephone: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  // Typage des paramètres pour handleInputChange
  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {

    if (!formData.NPI || !formData.Name || !formData.Firstname || !formData.Telephone || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.Password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const passwordUpperCasePattern = /(?=.*[A-Z])/;  // Vérifie qu'il y a au moins une lettre majuscule
    if (!passwordUpperCasePattern.test(formData.Password)) {
      setError('Le mot de passe doit contenir au moins une lettre majuscule');
      return;
    }

    const passwordSpecialCharPattern = /(?=.*[!@#$%^&*(),.?":{}|<>])/;  // Vérifie la présence d'un caractère spécial
    if (!passwordSpecialCharPattern.test(formData.Password)) {
      setError('Le mot de passe doit contenir au moins un caractère spécial  !@#$%^&*(),.? ');
      return;
    }

    const passwordDigitPattern = /(?=.*\d)/;  // Vérifie qu'il y a au moins un chiffre
    if (!passwordDigitPattern.test(formData.Password)) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      return;
    }

    const npiPattern = /^\d{10}$/;  // Expression régulière pour vérifier 10 chiffres
    if (!npiPattern.test(formData.NPI)) {
      setError('Le NPI doit contenir uniquement 10 chiffres');
      return;
    }

    const phoneLengthPattern = /^\d{10}$/;  // Vérifie que le numéro a bien 10 chiffres
    if (!phoneLengthPattern.test(formData.Telephone)) {
      setError('Le numéro doit contenir exactement 10 chiffres');
      return;
    }

    if (!formData.Telephone.startsWith('01')) { // Vérifie que le numéro commence par 01
      setError('Le numéro doit commencer par 01');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Expression régulière pour un email valide
    if (!emailPattern.test(formData.Email)) {
      setError('L\'adresse email n\'est pas valide');
      return;
    }

    try {
      const response = await fetch('https://access-backend-a961a1f4abb2.herokuapp.com/api/register', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NPI: formData.NPI,
          Username: formData.Email, // ou autre nom de champ pour le username
          Name: formData.Name,
          Firstname: formData.Firstname,
          Telephone: formData.Telephone,
          Email: formData.Email,
          Password: formData.Password,
          Role: 'EDUCATEUR', 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/Login');  // Redirection après inscription réussie
      } else {
        // Vérification de la structure de l'erreur et affichage des messages
        if (data.errors) {
          // Si le backend renvoie un objet avec des erreurs
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);  // Concatène les messages d'erreur
        } else {
          setError(data.error || 'Une erreur s\'est produite');
        }
      }
    } catch (error) {
      setError('Erreur de connexion avec le serveur');
    }
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image source={{ uri: 'https://i.postimg.cc/9QvqpzQZ/access-2.png' }} style={styles.icon} />
          </View>
          <Text style={styles.title}>Bienvenue à AcCess</Text>
          <Text style={styles.subtitle}>Veuillez remplir les champs suivants</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="NPI"
            keyboardType="phone-pad"
            value={formData.NPI}
            onChangeText={(text) => handleInputChange('NPI', text)}
          />
          <TextInput
            style={[styles.input, isFocused && styles.textAreaFocused]}
            placeholder="Noms"
            value={formData.Name}
            onFocus={() => setIsFocused(true)} 
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => handleInputChange('Name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénoms"
            value={formData.Firstname}
            onChangeText={(text) => handleInputChange('Firstname', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro"
            keyboardType="phone-pad"
            value={formData.Telephone}
            onChangeText={(text) => handleInputChange('Telephone', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.Email}
            onChangeText={(text) => handleInputChange('Email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={formData.Password}
            onChangeText={(text) => handleInputChange('Password', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            secureTextEntry
            value={formData.ConfirmPassword}
            onChangeText={(text) => handleInputChange('ConfirmPassword', text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.signUpText}>
          Vous avez déjà un compte ?{' '}
          <TouchableOpacity onPress={() => router.push('/Login')}>
            <Text style={styles.signUpLink}>Connectez-vous</Text>
          </TouchableOpacity>
        </Text>
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
    backgroundColor: '',
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
    fontSize: 10,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  textAreaFocused: {
    borderColor: 'orange',
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
  signUpText: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  signUpLink: {
    color: '#0a4191',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
});
