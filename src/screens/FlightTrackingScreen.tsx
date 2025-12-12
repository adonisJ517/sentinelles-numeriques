import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';
import { fetchFlights, FlightDto } from '../api';

const FlightTrackingScreen: React.FC = () => {
  const [flights, setFlights] = useState<FlightCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'boarding' | 'delayed' | 'ontime'>('all');

  const loadFlights = async (opts?: { silent?: boolean }) => {
    try {
      if (opts?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await fetchFlights();

      const mapped: FlightCardProps[] = data.map((flight: FlightDto) => {
        const departure = flight.departureTime ?? '';
        const time = departure ? departure.substring(11, 16) : '';

        let statusType: FlightCardProps['statusType'] = 'ontime';
        const status = flight.status?.toLowerCase() ?? '';
        if (status.includes('retard') || status.includes('delay')) {
          statusType = 'delayed';
        } else if (status.includes('embarq') || status.includes('board')) {
          statusType = 'boarding';
        }

        return {
          time: time || '—',
          planned: time || '—',
          status: flight.status || 'Prévu',
          statusType,
          fromCode: flight.origin,
          fromCity: flight.origin,
          toCode: flight.destination,
          toCity: flight.destination,
          flightCode: flight.flightNumber,
          company: '',
          gate: '',
          security: '',
        };
      });

      setFlights(mapped);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des vols');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFlights({ silent: true });
    }, []),
  );

  const filteredFlights = flights.filter((flight) => {
    if (statusFilter !== 'all' && flight.statusType !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        flight.flightCode.toLowerCase().includes(q) ||
        flight.fromCode.toLowerCase().includes(q) ||
        flight.toCode.toLowerCase().includes(q) ||
        flight.fromCity.toLowerCase().includes(q) ||
        flight.toCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Suivi de Vol</Text>
          <Text style={styles.helpText}>Aide</Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <MaterialIcons name="search" size={20} color="#9ca3af" style={{ marginHorizontal: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="N° vol, destination (ex: CDG, JFK)..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Segments */}
        <View style={styles.segmentRow}>
          <View style={[styles.segmentItem, styles.segmentItemActive]}>
            <Text style={[styles.segmentText, styles.segmentTextActive]}>Départs</Text>
          </View>
          <View style={styles.segmentItem}>
            <Text style={styles.segmentText}>Arrivées</Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <FilterChip
            label="Tous"
            active={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
          />
          <FilterChip
            label="À l'heure"
            active={statusFilter === 'ontime'}
            onPress={() => setStatusFilter('ontime')}
          />
          <FilterChip
            label="Retardé"
            active={statusFilter === 'delayed'}
            onPress={() => setStatusFilter('delayed')}
          />
          <FilterChip
            label="Embarquement"
            active={statusFilter === 'boarding'}
            onPress={() => setStatusFilter('boarding')}
          />
        </ScrollView>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFlights({ silent: true })}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Vols en temps réel</Text>
            {loading ? (
              <Text style={styles.badgeTime}>Chargement...</Text>
            ) : (
              <Text style={styles.badgeTime}>Mise à jour</Text>
            )}
          </View>

          {error ? (
            <Text style={{ color: '#f87171', marginTop: 8 }}>{error}</Text>
          ) : null}

          {!loading && !error && filteredFlights.length === 0 ? (
            <Text style={{ color: '#9ca3af', marginTop: 12 }}>
              Aucun vol ne correspond à votre recherche.
            </Text>
          ) : null}

          {(filteredFlights.length ? filteredFlights : []) .map((flight, index) => (
            <FlightCard key={`${flight.flightCode}-${index}`} {...flight} />
          ))}
        </ScrollView>

        <BottomNav active="flights" />
      </View>
    </SafeAreaView>
  );
};

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.filterChip, active && styles.filterChipActive]}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

interface FlightCardProps {
  time: string;
  planned: string;
  status: string;
  statusType: 'boarding' | 'delayed' | 'ontime';
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  flightCode: string;
  company: string;
  gate: string;
  security: string;
}

const FlightCard: React.FC<FlightCardProps> = ({
  time,
  planned,
  status,
  statusType,
  fromCode,
  fromCity,
  toCode,
  toCity,
  flightCode,
  company,
  gate,
  security,
}) => {
  const borderColor =
    statusType === 'boarding' ? colors.primary : statusType === 'delayed' ? '#f97316' : '#22c55e';

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }] }>
      <View style={styles.cardTopRow}>
        <View>
          <Text style={[styles.cardTime, statusType === 'delayed' && { color: '#f97316' }]}>{time}</Text>
          <Text
            style={[
              styles.cardPlanned,
              statusType === 'delayed' && { textDecorationLine: 'line-through' },
            ]}
          >
            Prévu: {planned}
          </Text>
        </View>
        <View
          style={[
            styles.cardStatusBadge,
            statusType === 'boarding' && styles.cardStatusBadgeBoarding,
            statusType === 'delayed' && styles.cardStatusBadgeDelayed,
            statusType === 'ontime' && styles.cardStatusBadgeOnTime,
          ]}
        >
          <Text
            style={[
              styles.cardStatusText,
              statusType === 'boarding' && { color: colors.primary },
              statusType === 'delayed' && { color: '#f97316' },
              statusType === 'ontime' && { color: '#22c55e' },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.cardRouteRow}>
        <View>
          <Text style={styles.airportCode}>{fromCode}</Text>
          <Text style={styles.airportCity}>{fromCity}</Text>
        </View>
        <View style={styles.cardPlaneCol}>
          <MaterialIcons
            name="flight"
            size={20}
            color="#6b7280"
            style={{ transform: [{ rotate: '90deg' }] }}
          />
          <View style={styles.cardLine} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.airportCode}>{toCode}</Text>
          <Text style={styles.airportCity}>{toCity}</Text>
        </View>
      </View>

      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMetaFlight}>{flightCode}</Text>
        <Text style={styles.cardMetaCompany}>{company}</Text>
      </View>

      <View style={styles.cardBottomRow}>
        <View style={styles.cardBottomBox}>
          <Text style={styles.bottomLabel}>Porte</Text>
          <Text style={styles.bottomValue}>{gate}</Text>
        </View>
        <View style={styles.cardBottomBox}>
          <Text style={styles.bottomLabel}>Sécurité</Text>
          <Text style={styles.bottomValue}>{security}</Text>
        </View>
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
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  helpText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 14,
    height: 48,
    marginHorizontal: 16,
    marginTop: 4,
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
    marginHorizontal: 16,
    marginTop: 8,
    padding: 4,
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
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceDark,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.black,
  },
  filterChipText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
  badgeTime: {
    fontSize: 11,
    color: '#9ca3af',
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  card: {
    marginTop: 10,
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTime: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '700',
  },
  cardPlanned: {
    fontSize: 11,
    color: '#9ca3af',
  },
  cardStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardStatusBadgeBoarding: {
    backgroundColor: 'rgba(19,127,236,0.1)',
    borderColor: 'rgba(19,127,236,0.4)',
  },
  cardStatusBadgeDelayed: {
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderColor: 'rgba(249,115,22,0.4)',
  },
  cardStatusBadgeOnTime: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderColor: 'rgba(34,197,94,0.4)',
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  airportCode: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '800',
  },
  airportCity: {
    fontSize: 11,
    color: '#9ca3af',
  },
  cardPlaneCol: {
    alignItems: 'center',
    width: 60,
  },
  cardLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#374151',
    marginTop: -4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#374151',
    paddingTop: 6,
  },
  cardMetaFlight: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
    marginRight: 6,
  },
  cardMetaCompany: {
    fontSize: 13,
    color: '#9ca3af',
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cardBottomBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingVertical: 8,
    alignItems: 'center',
  },
  bottomLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  bottomValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },
});

export default FlightTrackingScreen;
