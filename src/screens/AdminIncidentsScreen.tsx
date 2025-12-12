import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../components/BottomNav';
import AdminBottomNav from '../components/AdminBottomNav';
import { AuthUser, IncidentDto, fetchIncidents, updateIncidentStatus } from '../api';

const AdminIncidentsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminIncidents'>>();
  const user: AuthUser | undefined = route.params?.user;

  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await fetchIncidents();
      setIncidents(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setUpdatingId(id);
      const updated = await updateIncidentStatus(id, status);
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (e: any) {
      setError(e?.message ?? "Impossible de mettre à jour l'incident");
    } finally {
      setUpdatingId(null);
    }
  };

  const displayName = (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.iconShield}>
              <MaterialIcons name="security" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Incidents Sécurité</Text>
              <Text style={styles.headerSubtitle}>Admin {displayName}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Chargement des incidents...</Text>
            </View>
          )}

          {error && !loading && <Text style={styles.errorText}>{error}</Text>}

          {!loading && incidents.length === 0 && !error && (
            <Text style={styles.emptyText}>Aucun incident enregistré pour le moment.</Text>
          )}

          {incidents.map((incident) => (
            <View key={incident.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconCircle}>
                  <MaterialIcons name="warning" size={20} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{incident.type}</Text>
                  {incident.location ? (
                    <Text style={styles.cardSubtitle}>{incident.location}</Text>
                  ) : null}
                </View>
                <View style={getStatusChipStyle(incident.status || 'NOUVEAU')}>
                  <Text style={styles.statusChipText}>{incident.status || 'NOUVEAU'}</Text>
                </View>
              </View>

              {incident.description ? (
                <Text style={styles.cardDescription}>{incident.description}</Text>
              ) : null}

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={getActionButtonStyle('#f97316', 'left')}
                  disabled={updatingId === incident.id}
                  onPress={() => handleUpdateStatus(incident.id, 'EN_COURS')}
                >
                  <Text style={styles.actionButtonText}>Marquer en cours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={getActionButtonStyle('#22c55e', 'right')}
                  disabled={updatingId === incident.id}
                  onPress={() => handleUpdateStatus(incident.id, 'CLOS')}
                >
                  <Text style={styles.actionButtonText}>Clore</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <AdminBottomNav active="incidents" userParam={{ user }} />
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
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
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
  emptyText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#b91c1c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusChipBase: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusChipText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButtonBase: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLeft: {
    marginRight: 6,
  },
  actionButtonRight: {
    marginLeft: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
  },
});

const getStatusChipStyle = (status: string) => ({
  ...styles.statusChipBase,
  backgroundColor:
    status === 'CLOS'
      ? 'rgba(34,197,94,0.2)'
      : status === 'EN_COURS'
        ? 'rgba(249,115,22,0.2)'
        : 'rgba(239,68,68,0.2)',
});

const getActionButtonStyle = (color: string, position: 'left' | 'right') => [
  styles.actionButtonBase,
  position === 'left' ? styles.actionButtonLeft : styles.actionButtonRight,
  { backgroundColor: color },
];

export default AdminIncidentsScreen;
