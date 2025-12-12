import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';
import { createIncident } from '../api';

type IncidentType = 'bagage' | 'comportement' | 'technique' | 'autre';

const AnonIncidentScreen: React.FC = () => {
  const [type, setType] = useState<IncidentType>('bagage');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert('Informations manquantes', 'Veuillez renseigner une localisation.');
      return;
    }

    try {
      setSubmitting(true);
      await createIncident({
        type,
        location,
        description: description.trim() || undefined,
      });

      Alert.alert('Signalement envoyé', 'Merci pour votre contribution.');
      setDescription('');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? "Une erreur est survenue lors de l'envoi du signalement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.iconShield}>
              <MaterialIcons name="shield" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Signalement anonyme</Text>
              <Text style={styles.headerSubtitle}>Sécurité aéroportuaire</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.quitButton}>
            <MaterialIcons name="power-settings-new" size={18} color="#f97316" />
            <Text style={styles.quitText}>Quitter</Text>
          </TouchableOpacity>
        </View>

        {/* Info banner */}
        <View style={styles.infoBox}>
          <MaterialIcons name="visibility-off" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Votre identité n'est pas enregistrée. Ce signalement est traité de manière strictement anonyme.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Étape 1 */}
          <Text style={styles.stepTitle}>1. Quel est l'incident ?</Text>
          <View style={styles.gridRow}>
            <IncidentTypeCard
              label="Bagage abandonné"
              icon="luggage"
              selected={type === 'bagage'}
              onPress={() => setType('bagage')}
            />
            <IncidentTypeCard
              label="Comportement suspect"
              icon="visibility"
              selected={type === 'comportement'}
              onPress={() => setType('comportement')}
            />
          </View>
          <View style={styles.gridRow}>
            <IncidentTypeCard
              label="Panne technique"
              icon="build"
              selected={type === 'technique'}
              onPress={() => setType('technique')}
            />
            <IncidentTypeCard
              label="Autre incident"
              icon="more-horiz"
              selected={type === 'autre'}
              onPress={() => setType('autre')}
            />
          </View>

          {/* Étape 2 */}
          <Text style={styles.stepTitle}>2. Localisation</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="pin-drop" size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Terminal 2E, Porte K42, niveau départ"
              placeholderTextColor="#9ca3af"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={{ paddingHorizontal: 6 }}>
              <MaterialIcons name="my-location" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.locationChipsRow}
          >
            <LocationChip label="Terminal 1" />
            <LocationChip label="Terminal 2" />
            <LocationChip label="Zone contrôle" />
            <LocationChip label="Parking P3" />
          </ScrollView>

          {/* Étape 3 */}
          <Text style={styles.stepTitle}>
            3. Détails <Text style={styles.optionalLabel}>(optionnel)</Text>
          </Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Décrivez brièvement ce que vous observez..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.micButton}>
              <MaterialIcons name="mic" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.uploadBox}>
            <MaterialIcons name="add-a-photo" size={22} color="#9ca3af" />
            <Text style={styles.uploadText}>Ajouter une photo ou vidéo</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom action */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>Envoyer le signalement</Text>
            <MaterialIcons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <BottomNav active="services" />
      </View>
    </SafeAreaView>
  );
};

interface IncidentTypeCardProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selected?: boolean;
  onPress: () => void;
}

const IncidentTypeCard: React.FC<IncidentTypeCardProps> = ({ label, icon, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.incidentCard, selected && styles.incidentCardSelected]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View style={styles.incidentIconCircle}>
      <MaterialIcons name={icon} size={24} color={colors.white} />
    </View>
    <Text style={styles.incidentLabel}>{label}</Text>
  </TouchableOpacity>
);

const LocationChip: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.locationChip}>
    <Text style={styles.locationChipText}>{label}</Text>
  </View>
);

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconShield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  quitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#1f2933',
    gap: 4,
  },
  quitText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 4,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#9ca3af',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  stepTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  optionalLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  incidentCard: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  incidentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(19,127,236,0.15)',
  },
  incidentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  incidentLabel: {
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 52,
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  locationChipsRow: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  locationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    marginRight: 8,
  },
  locationChipText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  textAreaWrapper: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: colors.surfaceDark,
    padding: 10,
    position: 'relative',
  },
  textArea: {
    minHeight: 90,
    color: colors.white,
    fontSize: 14,
  },
  micButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 4,
  },
  uploadBox: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#111827',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 90,
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '700',
  },
});

export default AnonIncidentScreen;
