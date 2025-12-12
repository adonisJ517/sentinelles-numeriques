import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

const PaymentsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        <View style={styles.headerBar}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Historique & Réservations</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <View style={styles.statIconBadge}>
                  <MaterialIcons name="payments" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statLabel}>Dépenses (Oct)</Text>
              </View>
              <Text style={styles.statValue}>145,50 €</Text>
              <View style={styles.statTrendRow}>
                <MaterialIcons name="trending-up" size={14} color="#22c55e" />
                <Text style={styles.statTrendText}>+12% vs Sept</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <View style={styles.statIconBadge}>
                  <MaterialIcons name="calendar-today" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statLabel}>À venir</Text>
              </View>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statSub}>Réservations actives</Text>
            </View>
          </View>

          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={20} color="#6b7280" style={{ marginHorizontal: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par référence ou service..."
              placeholderTextColor="#6b7280"
            />
            <MaterialIcons name="tune" size={20} color="#6b7280" style={{ marginHorizontal: 8 }} />
          </View>

          <View style={styles.segmentRow}>
            <View style={[styles.segmentItem, styles.segmentItemActive]}>
              <Text style={[styles.segmentText, styles.segmentTextActive]}>Tous</Text>
            </View>
            <View style={styles.segmentItem}>
              <Text style={styles.segmentText}>Paiements</Text>
            </View>
            <View style={styles.segmentItem}>
              <Text style={styles.segmentText}>Réservations</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Aujourd'hui</Text>

          <PaymentCard
            icon="local-parking"
            iconColor={colors.primary}
            title="Parking P3 - Longue Durée"
            refId="#PK-883920"
            amount="45,00 €"
            status="Payé"
            statusColor="#22c55e"
            datetime="24 Oct 2023 • 14:30"
            payment="Visa •••• 4242"
          />

          <PaymentCard
            icon="star"
            iconColor="#a855f7"
            title="Salon VIP - Terminal 2"
            refId="#VIP-2910"
            amount="35,00 €"
            status="À venir"
            statusColor="#f59e0b"
            datetime="24 Oct 2023 • 18:00"
            payment="Billet scanné"
          />
        </ScrollView>

        <BottomNav active="services" />
      </View>
    </SafeAreaView>
  );
};

interface PaymentCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
  refId: string;
  amount: string;
  status: string;
  statusColor: string;
  datetime: string;
  payment: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  icon,
  iconColor,
  title,
  refId,
  amount,
  status,
  statusColor,
  datetime,
  payment,
}) => (
  <View style={styles.card}>
    <View style={styles.cardTopRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.cardIcon, { backgroundColor: 'rgba(19,127,236,0.1)' }]}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardRef}>{`Réf: ${refId}`}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.cardAmount}>{amount}</Text>
        <View style={styles.cardStatusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.cardStatusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
    </View>
    <View style={styles.cardDivider} />
    <View style={styles.cardBottomRow}>
      <View style={styles.cardBottomItem}>
        <MaterialIcons name="schedule" size={14} color="#9ca3af" />
        <Text style={styles.cardBottomText}>{datetime}</Text>
      </View>
      <View style={styles.cardBottomItem}>
        <MaterialIcons name="credit-card" size={14} color="#9ca3af" />
        <Text style={styles.cardBottomText}>{payment}</Text>
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
    marginRight: 40,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    padding: 12,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(19,127,236,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '700',
    marginTop: 4,
  },
  statTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  statTrendText: {
    fontSize: 11,
    color: '#22c55e',
  },
  statSub: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  searchWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1f2933',
    borderRadius: 16,
    padding: 4,
    marginTop: 12,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  segmentItemActive: {
    backgroundColor: colors.surfaceDark,
  },
  segmentText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  segmentTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cardRef: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  cardAmount: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardBottomText: {
    fontSize: 11,
    color: '#9ca3af',
  },
});

export default PaymentsScreen;
