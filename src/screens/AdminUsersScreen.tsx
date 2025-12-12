import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../components/BottomNav';
import AdminBottomNav from '../components/AdminBottomNav';
import { colors } from '../theme/colors';
import { AuthUser } from '../api';

type UserRole = 'ADMIN' | 'PASSAGER';

type UserStatus = 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';

interface BackOfficeUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastSeen?: string;
}

const API_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const USERS_API_URL = `${API_HOST}/api/users`;

const FILTERS: { key: 'TOUS' | UserRole; label: string }[] = [
  { key: 'TOUS', label: 'Tous' },
  { key: 'ADMIN', label: 'Admin' },
  { key: 'PASSAGER', label: 'Passager' },
];

const AdminUsersScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminUsers'>>();
  const navigation = useNavigation();
  const nav: any = navigation;
  const user: AuthUser | undefined = route.params?.user;

  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('TOUS');
  const [users, setUsers] = useState<BackOfficeUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName =
    (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  const fetchUsers = async (opts?: { silent?: boolean }) => {
    try {
      if (opts?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await fetch(USERS_API_URL, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status} ${response.statusText}: ${text}`);
      }

      const data = (await response.json()) as Array<{
        id: number;
        fullName: string;
        email: string;
        role: string;
        status?: string;
      }>;

      const normalized = data.map((u) => {
        const roleRaw = (u.role || 'PASSAGER').toUpperCase();
        const role = roleRaw === 'USER' ? 'PASSAGER' : roleRaw;
        const status = (u.status || 'ACTIF').toUpperCase();
        return {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          role: (['ADMIN', 'PASSAGER'].includes(role)
            ? (role as UserRole)
            : 'PASSAGER'),
          status: (['ACTIF', 'INACTIF', 'EN_ATTENTE'].includes(status)
            ? (status as UserStatus)
            : 'ACTIF'),
          lastSeen: undefined,
        } as BackOfficeUser;
      });

      setUsers(normalized);
    } catch (e) {
      console.error('Erreur API (users):', e);
      setError(e instanceof Error ? e.message : 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => (filter === 'TOUS' ? true : u.role === filter));
  }, [users, filter]);

  const updateUserStatus = async (id: number, status: UserStatus) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await fetch(`${USERS_API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Erreur update status');
      await fetchUsers({ silent: true });
    } catch (e) {
      console.error('Erreur API (update status):', e);
      Alert.alert('Erreur', "Impossible de modifier le statut.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: number, role: UserRole) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await fetch(`${USERS_API_URL}/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error('Erreur update role');
      await fetchUsers({ silent: true });
    } catch (e) {
      console.error('Erreur API (update role):', e);
      Alert.alert('Erreur', "Impossible de modifier le rôle.");
    } finally {
      setLoading(false);
    }
  };

  const openUserActions = (u: BackOfficeUser) => {
    if (loading) return;
    const toggleStatus: UserStatus = u.status === 'ACTIF' ? 'INACTIF' : 'ACTIF';

    Alert.alert(
      'Actions',
      `${u.fullName}`,
      [
        {
          text: u.status === 'ACTIF' ? 'Désactiver' : 'Activer',
          onPress: () => updateUserStatus(u.id, toggleStatus),
        },
        { text: 'Rôle: Admin', onPress: () => updateUserRole(u.id, 'ADMIN') },
        { text: 'Rôle: Passager', onPress: () => updateUserRole(u.id, 'PASSAGER') },
        { text: 'Annuler', style: 'cancel' },
      ],
    );
  };

  const handleBack = () => {
    // @ts-ignore
    if (navigation.canGoBack && (navigation as any).canGoBack()) {
      (navigation as any).goBack();
    } else {
      nav.navigate('AdminDashboard', { user });
    }
  };

  const renderRoleChip = (role: UserRole) => {
    if (role === 'ADMIN') {
      return (
        <View style={[styles.roleChip, styles.roleChipAdmin]}>
          <MaterialIcons
            name="shield"
            size={14}
            color="#4f46e5"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.roleChipText}>Super Admin</Text>
        </View>
      );
    }

    if (role === 'PASSAGER') {
      return (
        <View style={[styles.roleChip, styles.roleChipOps]}>
          <MaterialIcons
            name="flight"
            size={14}
            color={colors.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.roleChipText}>Passager</Text>
        </View>
      );
    }

    return null;
  };

  const renderStatusChip = (status: UserStatus) => {
    if (status === 'ACTIF') {
      return (
        <View style={[styles.statusChip, styles.statusChipActive]}>
          <Text style={styles.statusChipText}>Actif</Text>
        </View>
      );
    }
    if (status === 'INACTIF') {
      return (
        <View style={[styles.statusChip, styles.statusChipInactive]}>
          <Text style={styles.statusChipText}>Inactif</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusChip, styles.statusChipPending]}>
        <Text style={styles.statusChipText}>En attente</Text>
      </View>
    );
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
            <Text style={styles.headerTitle}>Gestion utilisateurs</Text>
            <Text style={styles.headerSubtitle}>Admin {displayName}</Text>
          </View>
          <TouchableOpacity style={styles.headerRightIcon} onPress={fetchUsers}>
            <MaterialIcons name="person-add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  filter === f.key && styles.filterChipActive,
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === f.key && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchUsers({ silent: true })}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              Membres ({filteredUsers.length})
            </Text>
            <View style={styles.sortRow}>
              <MaterialIcons
                name="sort"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.sortText}>Trier</Text>
            </View>
          </View>

          {loading && users.length === 0 ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.loadingBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {filteredUsers.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userHeaderRow}>
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarInitials}>
                    <Text style={styles.avatarInitialsText}>
                      {u.fullName
                        .split(' ')
                        .map((p) => p[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{u.fullName}</Text>
                    <Text style={styles.userEmail}>{u.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => openUserActions(u)}>
                  <MaterialIcons
                    name="more-vert"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.userMetaRow}>
                {renderRoleChip(u.role)}
                {renderStatusChip(u.status)}
                <View style={styles.lastSeenRow}>
                  <MaterialIcons
                    name="history"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.lastSeenText}>{u.lastSeen || '—'}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <AdminBottomNav active="users" userParam={{ user }} />
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
  filtersRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  filtersScroll: {
    paddingVertical: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceDark,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  listHeaderTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  userCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarInitials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(19,127,236,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitialsText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  userName: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
  },
  roleChipAdmin: {
    backgroundColor: 'rgba(79,70,229,0.12)',
  },
  roleChipSecurity: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  roleChipOps: {
    backgroundColor: 'rgba(19,127,236,0.12)',
  },
  roleChipSupport: {
    backgroundColor: 'rgba(249,115,22,0.12)',
  },
  roleChipText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginLeft: 4,
  },
  statusChipActive: {
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  statusChipInactive: {
    backgroundColor: 'rgba(148,163,184,0.25)',
  },
  statusChipPending: {
    backgroundColor: 'rgba(234,179,8,0.22)',
  },
  statusChipText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '500',
  },
  lastSeenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  lastSeenText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginTop: 10,
  },
  errorText: {
    color: colors.white,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AdminUsersScreen;
