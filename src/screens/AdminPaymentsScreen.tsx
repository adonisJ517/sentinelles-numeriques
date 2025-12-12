import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../components/BottomNav';
import AdminBottomNav from '../components/AdminBottomNav';
import { colors } from '../theme/colors';
import { AuthUser } from '../api';

type PaymentStatus = 'VALIDE' | 'EN_ATTENTE' | 'ECHEC';

interface PaymentItem {
  id: string;
  passenger: string;
  label: string;
  amount: string;
  time: string;
  status: PaymentStatus;
  kind: 'FAST_TRACK' | 'LOUNGE' | 'PARKING' | 'DUTY_FREE' | 'SECURITY' | 'RESTAURATION';
}

const TODAY_PAYMENTS: PaymentItem[] = [
  {
    id: 'TXN-8842',
    passenger: 'Jean Dupont',
    label: 'Fast Track',
    amount: '45.00 €',
    time: '14:30',
    status: 'VALIDE',
    kind: 'FAST_TRACK',
  },
  {
    id: 'TXN-8841',
    passenger: 'Marie Curie',
    label: 'Salon VIP',
    amount: '120.00 €',
    time: '13:15',
    status: 'EN_ATTENTE',
    kind: 'LOUNGE',
  },
  {
    id: 'TXN-8840',
    passenger: 'Pierre Martin',
    label: 'Parking',
    amount: '15.50 €',
    time: '11:45',
    status: 'ECHEC',
    kind: 'PARKING',
  },
];

const YESTERDAY_PAYMENTS: PaymentItem[] = [
  {
    id: 'TXN-8839',
    passenger: 'Sophie Germain',
    label: 'Duty Free',
    amount: '230.00 €',
    time: '18:20',
    status: 'VALIDE',
    kind: 'DUTY_FREE',
  },
  {
    id: 'TXN-8838',
    passenger: 'Albert Camus',
    label: 'Pass Sécurité',
    amount: '85.00 €',
    time: '09:10',
    status: 'VALIDE',
    kind: 'SECURITY',
  },
  {
    id: 'TXN-8837',
    passenger: 'Café de Paris',
    label: 'Restauration',
    amount: '24.50 €',
    time: '08:45',
    status: 'VALIDE',
    kind: 'RESTAURATION',
  },
];

const FILTERS: { key: 'TOUT' | PaymentStatus | 'FAST_TRACK'; label: string }[] = [
  { key: 'TOUT', label: 'Tout voir' },
  { key: 'VALIDE', label: 'Validé' },
  { key: 'EN_ATTENTE', label: 'En attente' },
  { key: 'ECHEC', label: 'Échoué' },
  { key: 'FAST_TRACK', label: 'Fast Track' },
];

const AdminPaymentsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminPayments'>>();
  const navigation = useNavigation();
  const nav: any = navigation;
  const user: AuthUser | undefined = route.params?.user;

  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('TOUT');

  const displayName =
    (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  const allPayments = [...TODAY_PAYMENTS, ...YESTERDAY_PAYMENTS];

  const filtered = allPayments.filter((p) => {
    if (filter === 'TOUT') return true;
    if (filter === 'FAST_TRACK') return p.kind === 'FAST_TRACK';
    if (filter === 'VALIDE' || filter === 'EN_ATTENTE' || filter === 'ECHEC') {
      return p.status === filter;
    }
    return false;
  });

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
            <Text style={styles.headerTitle}>Historique paiements</Text>
            <Text style={styles.headerSubtitle}>Admin {displayName}</Text>
          </View>
          <View style={styles.headerRightIcon}>
            <MaterialIcons name="share" size={22} color={colors.primary} />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconPrimary}>
                <MaterialIcons name="payments" size={18} color={colors.primary} />
              </View>
              <Text style={styles.statLabel}>Total du jour</Text>
              <Text style={styles.statValue}>12 450 €</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconGreen}>
                <MaterialIcons name="receipt-long" size={18} color="#22c55e" />
              </View>
              <Text style={styles.statLabel}>Transactions</Text>
              <Text style={styles.statValue}>142</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconAmber}>
                <MaterialIcons name="pending" size={18} color="#f59e0b" />
              </View>
              <Text style={styles.statLabel}>En attente</Text>
              <Text style={styles.statValue}>8</Text>
            </View>
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

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Aujourd'hui</Text>
          </View>

          {TODAY_PAYMENTS.filter((p) => filtered.includes(p)).map((p) => (
            <PaymentRow key={p.id} item={p} />
          ))}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Hier</Text>
          </View>

          {YESTERDAY_PAYMENTS.filter((p) => filtered.includes(p)).map((p) => (
            <PaymentRow key={p.id} item={p} />
          ))}

          <View style={styles.loadMoreWrapper}>
            <Text style={styles.loadMoreText}>Charger plus d'activités</Text>
          </View>
        </ScrollView>
        <AdminBottomNav active="payments" userParam={{ user }} />
      </View>
    </SafeAreaView>
  );
};

const PaymentRow: React.FC<{ item: PaymentItem }> = ({ item }) => {
  const isSuccess = item.status === 'VALIDE';
  const isPending = item.status === 'EN_ATTENTE';

  const iconName =
    item.kind === 'FAST_TRACK'
      ? 'directions-run'
      : item.kind === 'LOUNGE'
        ? 'chair'
        : item.kind === 'PARKING'
          ? 'local-parking'
          : item.kind === 'DUTY_FREE'
            ? 'shopping-bag'
            : item.kind === 'SECURITY'
              ? 'verified-user'
              : 'restaurant';

  return (
    <View style={styles.paymentRow}>
      <View style={styles.paymentIconWrapper}>
        <MaterialIcons name={iconName} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.paymentHeaderRow}>
          <Text style={styles.paymentPassenger}>{item.passenger}</Text>
          <Text style={styles.paymentAmount}>{item.amount}</Text>
        </View>
        <View style={styles.paymentMetaRow}>
          <Text style={styles.paymentMeta}>
            {item.label} • #{item.id}
          </Text>
          <Text style={styles.paymentTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.paymentStatusWrapper}>
        {isSuccess && (
          <MaterialIcons
            name="check-circle"
            size={18}
            color="#22c55e"
          />
        )}
        {isPending && (
          <MaterialIcons
            name="schedule"
            size={18}
            color="#f59e0b"
          />
        )}
        {!isSuccess && !isPending && (
          <MaterialIcons name="error" size={18} color="#ef4444" />
        )}
      </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 10,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statIconPrimary: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(19,127,236,0.15)',
  },
  statIconGreen: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  statIconAmber: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    marginTop: 2,
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  filtersRow: {
    marginTop: 10,
  },
  filtersScroll: {
    paddingHorizontal: 4,
    paddingVertical: 4,
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
  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1f2937',
  },
  paymentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(19,127,236,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentPassenger: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  paymentAmount: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },
  paymentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  paymentMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  paymentTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  paymentStatusWrapper: {
    marginLeft: 8,
  },
  loadMoreWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default AdminPaymentsScreen;
