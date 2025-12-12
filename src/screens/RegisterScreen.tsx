import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { registerUser } from '../api';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback((field?: keyof typeof errors) => {
    const newErrors = { ...errors };
    let hasErrors = false;

    const validations = {
      name: () => {
        if (field && field !== 'name') return;
        newErrors.name = !name.trim() ? 'Le nom est requis' : '';
      },
      email: () => {
        if (field && field !== 'email') return;
        newErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) 
          ? 'Veuillez entrer un email valide' 
          : '';
      },
      password: () => {
        if (field && field !== 'password') return;
        newErrors.password = password.length < 8 
          ? 'Le mot de passe doit contenir au moins 8 caractères' 
          : '';
      },
      confirmPassword: () => {
        if (field && field !== 'confirmPassword') return;
        newErrors.confirmPassword = password !== confirmPassword 
          ? 'Les mots de passe ne correspondent pas' 
          : '';
      }
    };

    if (field) {
      validations[field as keyof typeof validations]?.();
    } else {
      Object.values(validations).forEach(validation => validation());
    }

    hasErrors = Object.values(newErrors).some(error => error !== '');
    setErrors(newErrors);
    return !hasErrors;
  }, [name, email, password, confirmPassword, errors]);

  const handleRegister = useCallback(async () => {
    const isValid = await validateForm();
    
    if (!accepted) {
      setErrors(prev => ({
        ...prev,
        general: "Veuillez accepter les conditions d'utilisation"
      }));
      return;
    }

    if (isValid) {
      try {
        setLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));
        const user = await registerUser({
          fullName: name.trim(),
          email: email.trim(),
          password,
        });
        if (user.role === 'ADMIN') {
          navigation.navigate('AdminDashboard', { user });
        } else {
          navigation.navigate('Home', { user });
        }
      } catch (error) {
        const rawMessage = typeof (error as any)?.message === 'string'
          ? (error as any).message
          : "Une erreur est survenue lors de l'inscription";

        const isNetworkError = rawMessage.toLowerCase().includes('network request failed')
          || rawMessage.toLowerCase().includes('failed to fetch');

        const message = isNetworkError
          ? "Impossible de contacter le serveur. Vérifiez votre connexion."
          : rawMessage;

        setErrors(prev => ({
          ...prev,
          email: message.toLowerCase().includes('email') || message.toLowerCase().includes('déjà utilisé')
            ? message
            : prev.email,
          general: message,
        }));
        Alert.alert('Inscription échouée', message);
      } finally {
        setLoading(false);
      }
    }
  }, [validateForm, accepted, navigation, name, email, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.root}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity>
            <Text style={styles.helpText}>Aide</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <MaterialIcons name="verified-user" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez la plateforme unifiée pour optimiser votre parcours et sécuriser vos déplacements.
          </Text>

          <View style={{ marginTop: 16 }}>
            <Field
              label="Nom complet"
              icon="person"
              placeholder="Jean Dupont"
              value={name}
              onChangeText={setName}
              error={errors.name}
              onBlur={() => validateForm()}
              style={{ marginBottom: 12 }}
            />
            <Field
              label="Adresse e-mail"
              icon="mail"
              placeholder="jean@aeroport.com"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateForm('email')}
              keyboardType="email-address"
              error={errors.email}
              autoCapitalize="none"
            />
            <Field
              label="Mot de passe"
              icon="lock"
              placeholder="Min. 8 caractères"
              value={password}
              onChangeText={setPassword}
              onBlur={() => validateForm('password')}
              secureTextEntry
              error={errors.password}
              autoCapitalize="none"
            />
            <Field
              label="Confirmer le mot de passe"
              icon="lock-outline"
              placeholder="Répétez le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => validateForm('confirmPassword')}
              secureTextEntry
              error={errors.confirmPassword}
              autoCapitalize="none"
            />
            
            {errors.general ? (
              <Text style={[styles.errorText, { marginTop: 8 }]}>{errors.general}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setAccepted((v) => !v)}
            >
              <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                {accepted && <MaterialIcons name="check" size={16} color={colors.white} />}
              </View>
              <Text style={styles.checkboxText}>
                J'accepte la <Text style={styles.link}>Politique de confidentialité</Text> et les{' '}
                <Text style={styles.link}>Conditions d'utilisation</Text>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, (!accepted || loading) && { opacity: 0.5 }]}
              onPress={handleRegister}
              disabled={!accepted || loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Création du compte...' : "S'inscrire"}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Ou continuer avec</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.socialIconPlaceholder} />
              <Text style={styles.socialLabel}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="phone-iphone" size={20} color={colors.white} />
              <Text style={styles.socialLabel}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerWrapper}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

interface FieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap | string;
  error?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  error,
  onBlur,
}) => {
  const inputRef = useRef<TextInput | null>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel} onPress={focusInput}>
        {label}
      </Text>
      <View
        style={[
          styles.fieldInputWrapper,
          error ? styles.fieldInputError : null,
        ]}
      >
        <MaterialIcons
          name={icon as keyof typeof MaterialIcons.glyphMap}
          size={20}
          color={error ? '#ef4444' : '#9ca3af'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          ref={inputRef}
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2933',
  },
  helpText: {
    fontSize: 14,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroCard: {
    height: 120,
    borderRadius: 16,
    backgroundColor: 'rgba(19,127,236,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: colors.white,
    marginBottom: 4,
    marginLeft: 4,
  },
  fieldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fieldInputError: {
    borderColor: '#ef4444',
  },
  fieldInput: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    paddingVertical: 0,
    height: '100%',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: '#9ca3af',
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 48,
    gap: 8,
  },
  socialIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f97316',
  },
  socialLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  footerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default RegisterScreen;
