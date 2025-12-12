import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

const TravelRulesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Top bar */}
        <View style={styles.headerBar}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Règles & Infos</Text>
          <View style={styles.avatar} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Votre voyage */}
          <View style={styles.section}>
            <Text style={styles.label}>Votre voyage</Text>
            <View style={styles.inputRow}>
              <MaterialIcons
                name="flight-takeoff"
                size={22}
                color={colors.primary}
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Paris (CDG) -> Dubai (DXB)"
                placeholderTextColor="#9ca3af"
              />
              <MaterialIcons name="edit" size={18} color="#9ca3af" style={{ marginHorizontal: 8 }} />
            </View>
          </View>

          {/* Barre de recherche */}
          <View style={styles.section}>
            <View style={styles.searchRow}>
              <MaterialIcons
                name="search"
                size={20}
                color="#9ca3af"
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une règle, un objet..."
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Filtres */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <FilterChip label="Tout" active />
            <FilterChip label="Visas" icon="badge" />
            <FilterChip label="Bagages" icon="luggage" />
            <FilterChip label="Santé" icon="medical-services" />
            <FilterChip label="Sécurité" icon="security" />
          </ScrollView>

          {/* Alerte liquides */}
          <View style={styles.alertBox}>
            <MaterialIcons name="warning" size={20} color="#f59e0b" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Attention aux liquides</Text>
              <Text style={styles.alertText}>
                Les règles concernant les liquides en cabine sont strictement appliquées pour les vols vers
                Dubaï.
              </Text>
            </View>
          </View>

          {/* Documents essentiels */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Documents essentiels</Text>
              <Text style={styles.linkText}>Voir tout</Text>
            </View>
            <View style={styles.cardList}>
              <View style={styles.listItemRow}>
                <View style={styles.listIconCircle}>
                  <MaterialIcons name="flight" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>Passeport</Text>
                  <Text style={styles.listSubtitle}>Validité requise de 6 mois</Text>
                </View>
                <View style={styles.badgeRequis}>
                  <Text style={styles.badgeText}>Requis</Text>
                </View>
              </View>

              <View style={styles.listItemRow}>
                <View style={[styles.listIconCircle, { backgroundColor: 'rgba(168,85,247,0.1)' }]}>
                  <MaterialIcons name="assignment" size={20} color="#a855f7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>E-Visa Tourisme</Text>
                  <Text style={styles.listSubtitle}>Demande en ligne recommandée</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
              </View>
            </View>
          </View>

          {/* Sécurité & Bagages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité & Bagages</Text>
            <View style={styles.gridRow}>
              <MiniCard
                icon="opacity"
                title="Liquides"
                subtitle="Max 100ml par contenant"
              />
              <MiniCard
                icon="devices"
                title="Électronique"
                subtitle="Batteries en cabine"
              />
            </View>

            <View style={styles.expandCard}>
              <View style={styles.expandHeader}>
                <View style={styles.iconSmallCircle}>
                  <MaterialIcons name="block" size={18} color="#ef4444" />
                </View>
                <Text style={styles.expandTitle}>Objets Interdits</Text>
                <MaterialIcons name="expand-more" size={22} color="#9ca3af" style={{ marginLeft: 'auto' }} />
              </View>
              <View style={styles.expandBody}>
                <Bullet text="Objets tranchants (ciseaux > 6cm)" />
                <Bullet text="Outils de travail" />
                <Bullet text="Substances inflammables" />
                <View style={styles.expandButton}>
                  <Text style={styles.expandButtonText}>Voir la liste complète</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Le saviez-vous ? */}
          <View style={styles.section}>
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <MaterialIcons name="lightbulb" size={26} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>Gagnez du temps</Text>
                <Text style={styles.tipText}>
                  Préparer vos liquides dans un sac transparent avant d'arriver au contrôle peut vous faire
                  gagner jusqu'à 5 minutes.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav active="services" />
      </View>
    </SafeAreaView>
  );
};

interface FilterChipProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, icon, active }) => (
  <View style={[styles.chip, active && styles.chipActive]}>
    {icon && (
      <MaterialIcons
        name={icon}
        size={16}
        color={active ? colors.white : '#9ca3af'}
        style={{ marginRight: 4 }}
      />
    )}
    <Text style={[styles.chipTextLabel, active && styles.chipTextLabelActive]}>{label}</Text>
  </View>
);

const MiniCard: React.FC<{ icon: keyof typeof MaterialIcons.glyphMap; title: string; subtitle: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <View style={styles.miniCard}>
    <View style={styles.miniCardIconWrapper}>
      <MaterialIcons name={icon} size={22} color={colors.white} />
    </View>
    <Text style={styles.miniCardTitle}>{title}</Text>
    <Text style={styles.miniCardSubtitle}>{subtitle}</Text>
  </View>
);

const Bullet: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.bulletRow}>
    <MaterialIcons name="close" size={14} color="#ef4444" style={{ marginRight: 4 }} />
    <Text style={styles.bulletText}>{text}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2933',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2933',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 52,
  },
  textInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  chipsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceDark,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipTextLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chipTextLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fde68a',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#fbbf24',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  linkText: {
    fontSize: 13,
    color: colors.primary,
  },
  cardList: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    padding: 12,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19,127,236,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  badgeRequis: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  badgeText: {
    fontSize: 11,
    color: '#4ade80',
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    padding: 12,
  },
  miniCardIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  miniCardTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  miniCardSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  expandCard: {
    marginTop: 10,
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    padding: 12,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmallCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  expandTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  expandBody: {
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  expandButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(19,127,236,0.1)',
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  tipIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#e5e7eb',
  },
});

export default TravelRulesScreen;
