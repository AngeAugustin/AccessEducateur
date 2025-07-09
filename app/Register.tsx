import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { useFonts } from 'expo-font';
import Checkbox from 'expo-checkbox'; 
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';

// Définir le type pour formData
interface FormData {
  NPI: string;
  Name: string;
  Firstname: string;
  Telephone: string;
  Adresse: string;
  Matiere: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  acceptTerms: boolean;
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
    Adresse: '',
    Matiere: '',
    Password: '',
    ConfirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const router = useRouter();

  // Typage des paramètres pour handleInputChange
  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {

    if (!formData.NPI || !formData.Name || !formData.Firstname || !formData.Telephone || !formData.Matiere || !formData.Adresse || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité');
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
      const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/register_educateur', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NPI: formData.NPI,
          Username: formData.Email, 
          Name: formData.Name,
          Firstname: formData.Firstname,
          Telephone: formData.Telephone,
          Adresse: formData.Adresse,
          Matiere: formData.Matiere,
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
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
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
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={formData.Telephone}
            onChangeText={(text) => handleInputChange('Telephone', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Matière enseignée"
            value={formData.Matiere}
            onChangeText={(text) => handleInputChange('Matiere', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={formData.Adresse}
            onChangeText={(text) => handleInputChange('Adresse', text)}
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

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
          >
            <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
              {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              <TouchableOpacity onPress={() => Linking.openURL('https://votre-site-web.com/conditions-utilisation')}>
                <Text style={styles.linkText}>J'accepte les conditions d'utilisation et la politique de confidentialité</Text>
              </TouchableOpacity>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.signUpText}>
            Avez-vous déjà un compte ? <Text style={styles.signUpLink} onPress={() => router.push('/Login')}>Connectez-vous</Text>
          </Text>

      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#0a4191',
    borderColor: '#0a4191',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 11,
    color: '#0a4191',
    fontFamily: 'Montserrat_700Bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
