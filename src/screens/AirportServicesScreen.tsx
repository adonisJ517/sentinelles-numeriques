import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

const AirportServicesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Services Aéroportuaires</Text>
          <View style={styles.headerRightIcon}>
            <MaterialIcons name="map" size={24} color={colors.white} />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Barre de recherche */}
          <View style={styles.searchRow}>
            <MaterialIcons name="search" size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un service, une compagnie..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Filtres catégories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            <CategoryChip label="Tout" active />
            <CategoryChip label="Bagages & Compagnies" icon="luggage" primary />
            <CategoryChip label="Restauration" icon="restaurant" />
            <CategoryChip label="Boutiques" icon="shopping-bag" />
            <CategoryChip label="Transports" icon="directions-car" />
          </ScrollView>

          {/* À la une */}
          <Text style={styles.sectionTitle}>À la une</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
          >
            <FeaturedCard
              badge="-20%"
              title="Duty Free Special"
              subtitle="Parfums & Cosmétiques"
            />
            <FeaturedCard
              badge="Nouveau"
              title="Menu Gourmet"
              subtitle="Le Grand Chef"
              badgeColor="#22c55e"
            />
            <FeaturedCard title="Accès Salon VIP" subtitle="Terminal 2B" />
          </ScrollView>

          {/* Services Compagnies Aériennes */}
          <Text style={styles.sectionTitle}>Services Compagnies Aériennes</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceHeaderRow}>
              <View style={styles.iconCircleSmall}>
                <MaterialIcons name="luggage" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.serviceTitle}>Excédents de Bagages</Text>
                <Text style={styles.serviceSubtitle}>Payez vos suppléments bagages à l'avance.</Text>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Informations de Vol</Text>
              <View style={styles.fieldRow}>
                <View style={[styles.selectBox, { flex: 1.2 }]}>
                  <Text style={styles.selectPlaceholder}>Sélectionnez votre compagnie</Text>
                  <MaterialIcons
                    name="expand-more"
                    size={18}
                    color="#9ca3af"
                    style={styles.selectIcon}
                  />
                </View>
              </View>
              <View style={styles.fieldRow}>
                <View style={[styles.inputBox, { flex: 1 }] }>
                  <Text style={styles.inputPlaceholder}>N° Vol (ex: KP24)</Text>
                </View>
                <View style={[styles.inputBox, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputPlaceholder}>Date</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Détails Bagages</Text>
              <View style={styles.fieldRow}>
                <View style={[styles.inputBox, { flex: 1.2 }]}>
                  <Text style={styles.inputPlaceholder}>Poids excédentaire</Text>
                  <Text style={styles.unitText}>KG</Text>
                </View>
                <View style={[styles.totalBox, { flex: 1 }] }>
                  <Text style={styles.totalLabel}>Total estimé</Text>
                  <Text style={styles.totalValue}>0 FCFA</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Moyen de paiement</Text>
              <View style={styles.paymentRow}>
                <PaymentChoice label="Mobile Money" icon="smartphone" active />
                <PaymentChoice label="Carte Bancaire" icon="credit-card" />
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Numéro Mobile Money</Text>
              <View style={styles.fieldRow}>
                <View style={[styles.selectBox, { flex: 0.8 }]}>
                  <Text style={styles.selectPlaceholder}>+228</Text>
                  <MaterialIcons
                    name="expand-more"
                    size={18}
                    color="#9ca3af"
                    style={styles.selectIcon}
                  />
                </View>
                <View style={[styles.inputBox, { flex: 1.6, marginLeft: 8 }]}>
                  <Text style={styles.inputPlaceholder}>90 12 34 56</Text>
                </View>
              </View>
            </View>

            <View style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Payer l'excédent</Text>
              <MaterialIcons name="payments" size={18} color={colors.white} />
            </View>
          </View>

          {/* Services populaires */}
          <View style={styles.servicesHeaderRow}>
            <Text style={styles.sectionTitle}>Services Populaires</Text>
            <Text style={styles.linkText}>Voir tout</Text>
          </View>

          <ServiceItem
            title="Le Grand Café"
            subtitle="Terminal 2B • Restauration"
            status="Ouvert maintenant"
            action="Réserver"
          />
          <ServiceItem
            title="Horlogerie de Luxe"
            subtitle="Hall A • Shopping"
            status="Ouvert 24/7"
            action="Catalogue"
          />
          <ServiceItem
            title="Auto Rent"
            subtitle="Parking P1 • Location"
            status="Véhicules dispo."
            action="Louer"
          />
        </ScrollView>

        <BottomNav active="services" />
      </View>
    </SafeAreaView>
  );
};

interface CategoryChipProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
  primary?: boolean;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ label, icon, active, primary }) => (
  <View
    style={[
      styles.categoryChip,
      active && styles.categoryChipActive,
      primary && styles.categoryChipPrimary,
    ]}
  >
    {icon && (
      <MaterialIcons
        name={icon}
        size={18}
        color={primary || active ? colors.primary : colors.white}
        style={{ marginRight: 6 }}
      />
    )}
    <Text
      style={[
        styles.categoryChipText,
        active && styles.categoryChipTextActive,
        primary && styles.categoryChipTextPrimary,
      ]}
    >
      {label}
    </Text>
  </View>
);

const FeaturedCard: React.FC<{
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
}> = ({ badge, badgeColor = colors.primary, title, subtitle }) => (
  <View style={styles.featuredCard}>
    <View style={styles.featuredImage} />
    {badge && (
      <View style={[styles.featuredBadge, { backgroundColor: badgeColor }] }>
        <Text style={styles.featuredBadgeText}>{badge}</Text>
      </View>
    )}
    <Text style={styles.featuredTitle}>{title}</Text>
    <Text style={styles.featuredSubtitle}>{subtitle}</Text>
  </View>
);

const PaymentChoice: React.FC<{
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
}> = ({ label, icon, active }) => (
  <View style={[styles.paymentChoice, active && styles.paymentChoiceActive]}>
    <MaterialIcons
      name={icon}
      size={20}
      color={active ? colors.primary : '#9ca3af'}
      style={{ marginBottom: 4 }}
    />
    <Text style={[styles.paymentChoiceText, active && styles.paymentChoiceTextActive]}>
      {label}
    </Text>
  </View>
);

const ServiceItem: React.FC<{
  title: string;
  subtitle: string;
  status: string;
  action: string;
}> = ({ title, subtitle, status, action }) => (
  <View style={styles.serviceItem}>
    <View style={styles.serviceThumb} />
    <View style={{ flex: 1 }}>
      <View style={styles.serviceItemHeaderRow}>
        <Text style={styles.serviceItemTitle}>{title}</Text>
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#facc15" />
          <Text style={styles.ratingText}>4.8</Text>
        </View>
      </View>
      <Text style={styles.serviceItemSubtitle}>{subtitle}</Text>
      <Text style={styles.serviceItemStatus}>{status}</Text>
      <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
        <View style={styles.serviceActionButton}>
          <Text style={styles.serviceActionText}>{action}</Text>
        </View>
      </View>
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  headerRightIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 48,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  categoryRow: {
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceDark,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.black,
  },
  categoryChipPrimary: {
    backgroundColor: 'rgba(19,127,236,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19,127,236,0.3)',
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.white,
  },
  categoryChipTextActive: {
    fontWeight: '700',
  },
  categoryChipTextPrimary: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  featuredRow: {
    paddingVertical: 8,
    gap: 10,
  },
  featuredCard: {
    width: 120,
    marginRight: 10,
  },
  featuredImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: '#1f2933',
    marginBottom: 6,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featuredBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  featuredSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  serviceCard: {
    marginTop: 10,
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 14,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19,127,236,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  serviceTitle: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  fieldLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 11,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  selectPlaceholder: {
    fontSize: 13,
    color: '#9ca3af',
  },
  selectIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  inputBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputPlaceholder: {
    fontSize: 13,
    color: '#9ca3af',
  },
  unitText: {
    position: 'absolute',
    right: 10,
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
  },
  totalBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentChoice: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  paymentChoiceActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(19,127,236,0.1)',
  },
  paymentChoiceText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  paymentChoiceTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '700',
  },
  servicesHeaderRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    fontSize: 13,
    color: colors.primary,
  },
  serviceItem: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 10,
  },
  serviceThumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#1f2933',
    marginRight: 10,
  },
  serviceItemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceItemTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,204,21,0.15)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#facc15',
    fontWeight: '700',
  },
  serviceItemSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  serviceItemStatus: {
    fontSize: 12,
    color: '#22c55e',
    marginTop: 2,
  },
  serviceActionButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(19,127,236,0.15)',
  },
  serviceActionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default AirportServicesScreen;
