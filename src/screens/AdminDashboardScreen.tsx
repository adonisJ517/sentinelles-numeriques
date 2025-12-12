import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../components/BottomNav';
import AdminBottomNav from '../components/AdminBottomNav';
import { AdminDashboardStats, AuthUser, fetchAdminDashboardStats } from '../api';

const AdminDashboardScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminDashboard'>>();
  const navigation = useNavigation();
  const nav: any = navigation;
  const user: AuthUser | undefined = route.params?.user;

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminDashboardStats();
        setStats(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? 'Erreur de chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const displayName = (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <MaterialIcons name="shield" size={22} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.welcomeLabel}>Administration</Text>
              <Text style={styles.welcomeName}>Bonjour, {displayName}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={20} color={colors.white} />
              <View style={styles.notificationDot} />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>

          {loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Chargement des statistiques...</Text>
            </View>
          )}

          {error && !loading && <Text style={styles.errorText}>{error}</Text>}

          {stats && !loading && (
            <View style={styles.grid}>
              <StatCard
                icon="flight-takeoff"
                label="Vols"
                value={stats.totalFlights}
                color={colors.primary}
                onPress={() => nav.navigate('AdminAirlines', { user })}
              />
              <StatCard
                icon="groups"
                label="Utilisateurs"
                value={stats.totalUsers}
                color="#22c55e"
                onPress={() => nav.navigate('AdminUsers', { user })}
              />
              <StatCard
                icon="warning"
                label="Incidents"
                value={stats.totalIncidents}
                color="#f97316"
                onPress={() =>
                  // @ts-expect-error navigation generic
                  navigation.navigate('AdminIncidents', { user })
                }
              />
              <StatCard
                icon="luggage"
                label="Litiges bagages"
                value={stats.totalBaggageClaims}
                color="#e11d48"
                onPress={() => nav.navigate('AdminPayments', { user })}
              />
            </View>
          )}
        </ScrollView>
        <AdminBottomNav active="dashboard" userParam={{ user }} />
      </View>
    </SafeAreaView>
  );
};

interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: number;
  color: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, onPress }) => {
  return (
    <View style={styles.cardRoot}>
      <View style={[styles.cardIconWrapper, { backgroundColor: `${color}33` }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {onPress && (
        <Text style={styles.cardLink} onPress={onPress}>
          Voir détails
        </Text>
      )}
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
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerRight: {},
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
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  loadingWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: 16,
    color: '#f97316',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardRoot: {
    width: '48%',
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardValue: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '700',
    marginTop: 4,
  },
  cardLink: {
    marginTop: 6,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;
