import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { loginUser } from '../api';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Champs requis', 'Veuillez saisir votre e-mail et votre mot de passe.');
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser({ email: email.trim(), password });
      if (user.role === 'ADMIN') {
        navigation.navigate('AdminDashboard', { user });
      } else {
        navigation.navigate('Home', { user });
      }
    } catch (e: any) {
      Alert.alert(
        'Connexion échouée',
        e?.message ?? 'Impossible de vous connecter. Vérifiez vos identifiants.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.headerImageWrapper}>
            <ImageBackground
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8VVny9orQxL3SubmJFBKNpQLzLja5udb_tnZJQUBtXHyxIBQch6bzuiaUU5A0CtJIjgWQSGa2W4w4yl2eoxGUKGLNUgWvWGgI3EmJ1NOuui91jaIodTFFWW-VYNl5FAsqRZhMYeMK34iVm2BM44M7ombxyqcs96lc8ELdqAr0s9BiDjo2bBEVEWnOBxc1_UwJAaH2t8lVaHYPGd22hN9hr1ltSDyk4U-SDanVwpS_Rnd-MHiQTBIOzaRT3uba8dMjfInHhsVtGeE',
              }}
              style={styles.headerImage}
            >
              <View style={styles.headerOverlay} />
            </ImageBackground>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Plateforme Aéroportuaire Unifiée. Accédez à votre espace sécurisé.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail professionnel</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="mail"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="user@airport-security.com"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.iconButtonRight}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <View style={styles.faceIdWrapper}>
              <TouchableOpacity style={styles.faceIdButton}>
                <MaterialIcons name="face" size={32} color={colors.primary} />
                <Text style={styles.faceIdLabel}>Face ID</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
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
              <Text style={styles.footerText}>Pas encore de compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerImageWrapper: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
  },
  headerImage: {
    flex: 1,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTextWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9ca3af',
  },
  form: {
    flex: 1,
    gap: 8,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 4,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
  },
  iconButtonRight: {
    paddingLeft: 8,
  },
  forgotWrapper: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  faceIdWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  faceIdButton: {
    alignItems: 'center',
  },
  faceIdLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

export default LoginScreen;
