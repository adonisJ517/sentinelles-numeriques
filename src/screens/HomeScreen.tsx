import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ImageBackground
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvDITcv7RUVDiupJBvy50AIDZoKZn-U8_EloCIechgrVCvWPukFkD8zvAjq0rBfGPzsd3HcoAL6wMBTR_V8EsxGAikLFRJseWkGj-ZetJZhvTg9sfnH9JrWBrqEuEpABpI_3Tj85v0VHRPMYNV2Ov2wAuD75QnkuDWPvqmbyE9UO3gj7YCrkWhXwwL0vP0StT6rSibMMzSdNyDlPEqgImMcLLMox0BykuOoPUNqkHDJGTWiFLpxERRd2ltE4vdXuZd0gVR-6whw8',
              }}
              style={styles.avatar}
              imageStyle={{ borderRadius: 999 }}
            />
            <View>
              <Text style={styles.welcomeLabel}>Bienvenue</Text>
              <Text style={styles.welcomeName}>Bonjour, Thomas</Text>
            </View>
          </View>
          <View>
            <View style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={22} color={colors.white} />
              <View style={styles.notificationDot} />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Alerte sécurité */}
          <View style={styles.alertCard}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <MaterialIcons
                name="warning"
                size={22}
                color="#facc15"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <View>
                <Text style={styles.alertTitle}>Alerte Sécurité - Terminal 2E</Text>
                <Text style={styles.alertSubtitle}>
                  Temps d'attente élevé (&gt;25 min) aux contrôles.
                </Text>
              </View>
            </View>
            <View style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Détails</Text>
            </View>
          </View>

          {/* Prochain vol */}
          <View style={{ marginTop: 12 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Prochain Vol</Text>
              <View style={styles.chipOnTime}>
                <View style={styles.chipDot} />
                <Text style={styles.chipText}>À l'heure</Text>
              </View>
            </View>

            <View style={styles.flightCard}>
              <View style={styles.flightImageWrapper}>
                <View style={styles.flightGradient} />
                <ImageBackground
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_FnT-L4OQb2hQmYPWFc7WnPzns1ufkRlceCkLSihKiLrlek3EhsjAqvH6_AvRVRB1FkJ9kr5hdx8CtB6hfCrdS7FlWdZts1tF1eo4cn9am_ef_Q3V_FGH_FyAvDqj_jBYRqAZFlYpUDj9_LlN_Jq_kKh8rCu23OkbM8BiWLv_WwBmLc7kc18_GWrDDsGRhGWaTRmFm94sTvFYENzmbg70qNM31FWw3fguHtoCwqMpfH9QTLSt1GY6CaByA2zKfL2CEkrRaEFwGa4',
                  }}
                  style={styles.flightImage}
                >
                  <View style={styles.flightOverlayContent}>
                    <Text style={styles.flightCity}>New York (JFK)</Text>
                    <Text style={styles.flightSubtitle}>Vol AF1234 • Air France</Text>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.flightDetailsWrapper}>
                <View style={styles.flightTimesRow}>
                  <View style={styles.flightTimeBlock}>
                    <Text style={styles.flightTime}>14:30</Text>
                    <Text style={styles.flightAirport}>CDG</Text>
                  </View>

                  <View style={styles.flightMiddle}>
                    <MaterialIcons
                      name="flight"
                      size={20}
                      color={colors.textSecondary}
                      style={{ transform: [{ rotate: '90deg' }], marginBottom: 4 }}
                    />
                    <View style={styles.flightDurationBar}>
                      <View style={styles.flightDurationChip}>
                        <Text style={styles.flightDurationText}>7h 45m</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.flightTimeBlock}>
                    <Text style={styles.flightTime}>16:15</Text>
                    <Text style={styles.flightAirport}>JFK</Text>
                  </View>
                </View>

                <View style={styles.flightMetaRow}>
                  <View style={styles.flightMetaCard}>
                    <Text style={styles.flightMetaLabel}>Terminal</Text>
                    <Text style={styles.flightMetaValue}>2E</Text>
                  </View>
                  <View style={styles.flightMetaCard}>
                    <Text style={styles.flightMetaLabel}>Porte</Text>
                    <Text style={[styles.flightMetaValue, { color: colors.primary }]}>K42</Text>
                  </View>
                  <View style={styles.flightMetaCard}>
                    <Text style={styles.flightMetaLabel}>Siège</Text>
                    <Text style={styles.flightMetaValue}>12A</Text>
                  </View>
                </View>

                <View style={styles.boardingButton}>
                  <Text style={styles.boardingButtonText}>Voir la carte d'embarquement</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Parcours voyageur */}
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Parcours Voyageur</Text>
            <View style={styles.timelineRow}>
              <View style={styles.timelineLineBackground} />
              <View style={styles.timelineLineActive} />
              <View style={styles.timelineStep}>
                <View style={[styles.timelineCircle, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="check" size={14} color={colors.white} />
                </View>
                <Text style={[styles.timelineLabel, { color: colors.primary }]}>Enregistré</Text>
              </View>
              <View style={styles.timelineStep}>
                <View style={[styles.timelineCircle, styles.timelineCircleActive]}>
                  <MaterialIcons name="security" size={14} color={colors.white} />
                </View>
                <Text style={[styles.timelineLabel, { color: colors.white }]}>Sécurité</Text>
              </View>
              <View style={styles.timelineStep}>
                <View style={styles.timelineCircleMuted} />
                <Text style={styles.timelineLabelMuted}>Porte</Text>
              </View>
              <View style={styles.timelineStep}>
                <View style={styles.timelineCircleMuted} />
                <Text style={styles.timelineLabelMuted}>Embarquement</Text>
              </View>
            </View>
          </View>

          {/* Services rapides */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Services Rapides</Text>
            <View style={styles.quickGrid}>
              <QuickAction icon="local-parking" label="Parking" color={colors.primary} />
              <QuickAction icon="store" label="Boutiques" color="#fb923c" />
              <QuickAction icon="map" label="Plan" color="#4ade80" />
              <QuickAction icon="help-outline" label="Aide" color="#c4b5fd" />
            </View>
          </View>

          {/* Vols suivis */}
          <View style={{ marginTop: 16, paddingBottom: 80 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Vols Suivis</Text>
              <Text style={styles.linkText}>Voir tout</Text>
            </View>
            <View style={styles.followCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.followAvatar}>
                  <MaterialIcons
                    name="flight"
                    size={18}
                    color={colors.textSecondary}
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>
                <View>
                  <Text style={styles.followTitle}>BA304 • LHR - CDG</Text>
                  <Text style={styles.followSubtitle}>Arrivée prévue: 15:45</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.followStatus}>Atterri</Text>
                <Text style={styles.followSubtitle}>Terminal 2E</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav active="home" />
      </View>
    </SafeAreaView>
  );
};

// Composant QuickAction pour les actions rapides
type QuickActionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
};

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, color }) => (
  <View style={styles.quickAction}>
    <View style={[styles.quickIcon, { backgroundColor: `${color}20` }]}>
      <MaterialIcons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.quickLabel}>{label}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#293038',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  welcomeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1c2127',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: colors.backgroundDark,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  alertCard: {
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 53, 15, 0.6)',
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  alertSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  alertButton: {
    backgroundColor: 'rgba(19,127,236,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  alertButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  chipOnTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 4,
  },
  chipText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  flightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceDark,
  },
  flightImageWrapper: {
    height: 150,
  },
  flightImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flightGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1,
  },
  flightOverlayContent: {
    padding: 16,
    zIndex: 2,
  },
  flightCity: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  flightSubtitle: {
    color: '#d1d5db',
    fontSize: 13,
    marginTop: 2,
  },
  flightDetailsWrapper: {
    padding: 16,
    gap: 12,
  },
  flightTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#374151',
    paddingBottom: 12,
  },
  flightTimeBlock: {
    alignItems: 'center',
  },
  flightTime: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '700',
  },
  flightAirport: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  flightMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  flightDurationBar: {
    height: 1,
    width: '100%',
    backgroundColor: '#374151',
    justifyContent: 'center',
  },
  flightDurationChip: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.surfaceDark,
  },
  flightDurationText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  flightMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  flightMetaCard: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  flightMetaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  flightMetaValue: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  boardingButton: {
    marginTop: 4,
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  boardingButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  timelineCard: {
    marginTop: 16,
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 16,
  },
  timelineTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineLineBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    height: 2,
    backgroundColor: '#374151',
  },
  timelineLineActive: {
    position: 'absolute',
    left: 0,
    width: '50%',
    top: 12,
    height: 2,
    backgroundColor: colors.primary,
  },
  timelineStep: {
    alignItems: 'center',
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  timelineCircleMuted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: colors.surfaceDark,
  },
  timelineLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  timelineLabelMuted: {
    fontSize: 10,
    marginTop: 4,
    color: colors.textSecondary,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAction: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  linkText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  followCard: {
    marginTop: 8,
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2933',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2933',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  followTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },
  followSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  followStatus: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '700',
  },
});

export default HomeScreen;
