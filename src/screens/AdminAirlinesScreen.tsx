import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../components/BottomNav';
import AdminBottomNav from '../components/AdminBottomNav';
import { colors } from '../theme/colors';
import { AuthUser } from '../api';

interface Airline {
  id: number;
  name: string;
  code: string;
  servicesCount: number;
  status: 'ACTIF' | 'INACTIF' | 'MAINTENANCE';
}

const MOCK_AIRLINES: Airline[] = [
  { id: 1, name: 'Air France', code: 'AF', servicesCount: 3, status: 'ACTIF' },
  { id: 2, name: 'Royal Air Maroc', code: 'AT', servicesCount: 2, status: 'ACTIF' },
  { id: 3, name: 'Ethiopian Airlines', code: 'ET', servicesCount: 1, status: 'MAINTENANCE' },
  { id: 4, name: 'Turkish Airlines', code: 'TK', servicesCount: 4, status: 'ACTIF' },
  { id: 5, name: 'British Airways', code: 'BA', servicesCount: 0, status: 'INACTIF' },
];

const AdminAirlinesScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminAirlines'>>();
  const navigation = useNavigation();
  const nav: any = navigation;
  const user: AuthUser | undefined = route.params?.user;

  const [query, setQuery] = useState('');

  const displayName =
    (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  const filteredAirlines = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_AIRLINES;
    return MOCK_AIRLINES.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q),
    );
  }, [query]);

  const handleBack = () => {
    // @ts-ignore
    if (navigation.canGoBack && (navigation as any).canGoBack()) {
      (navigation as any).goBack();
    } else {
      nav.navigate('AdminDashboard', { user });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconCircle} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTexts}>
            <Text style={styles.headerTitle}>Compagnies &amp; services</Text>
            <Text style={styles.headerSubtitle}>Admin {displayName}</Text>
          </View>
          <View style={styles.headerRightIcon}>
            <MaterialIcons name="add" size={24} color={colors.primary} />
          </View>
        </View>

        <View style={styles.searchRow}>
          <MaterialIcons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher (nom, code IATA)..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
          <MaterialIcons
            name="tune"
            size={20}
            color={colors.textSecondary}
            style={{ marginHorizontal: 8 }}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Partenaires actifs</Text>

          {filteredAirlines.map((airline) => (
            <View
              key={airline.id}
              style={[
                styles.airlineCard,
                airline.status === 'INACTIF' && styles.airlineCardInactive,
              ]}
            >
              <View style={styles.airlineLogo}>
                <Text style={styles.airlineLogoText}>{airline.code}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.airlineHeaderRow}>
                  <Text style={styles.airlineName}>{airline.name}</Text>
                  <View style={getStatusChipStyle(airline.status)}>
                    <Text style={styles.statusText}>{airline.status}</Text>
                  </View>
                </View>
                <Text style={styles.airlineMeta}>
                  Code: {airline.code} • Services: {airline.servicesCount} configurés
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={colors.textSecondary}
              />
            </View>
          ))}
        </ScrollView>
        <AdminBottomNav active="airlines" userParam={{ user }} />
      </View>
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
  headerTexts: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
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
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  airlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  airlineCardInactive: {
    opacity: 0.7,
  },
  airlineLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(148,163,184,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  airlineLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  airlineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  airlineName: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  airlineMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusChipBase: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
});

const getStatusChipStyle = (status: Airline['status']) => ({
  ...styles.statusChipBase,
  backgroundColor:
    status === 'ACTIF'
      ? 'rgba(34,197,94,0.2)'
      : status === 'MAINTENANCE'
        ? 'rgba(250,204,21,0.2)'
        : 'rgba(148,163,184,0.3)',
});

export default AdminAirlinesScreen;
