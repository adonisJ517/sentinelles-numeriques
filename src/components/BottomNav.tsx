import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthUser } from '../api';

export type RootStackParamList = {
  Home: { user?: AuthUser } | undefined;
  FlightTracking: undefined;
  Services: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  Payments: undefined;
  TravelRules: undefined;
  AirportServices: undefined;
  AnonIncident: undefined;
  BaggageIssue: undefined;
  AdminDashboard: { user?: AuthUser } | undefined;
  AdminIncidents: { user?: AuthUser } | undefined;
  AdminAirlines: { user?: AuthUser } | undefined;
  AdminContent: { user?: AuthUser } | undefined;
  AdminUsers: { user?: AuthUser } | undefined;
  AdminPayments: { user?: AuthUser } | undefined;
};

export type BottomNavKey = 'home' | 'flights' | 'services' | 'profile';

interface BottomNavProps {
  active: BottomNavKey;
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <NavItem
        label="Accueil"
        icon="home"
        active={active === 'home'}
        onPress={() => navigation.navigate('Home')}
      />
      <NavItem
        label="Vols"
        icon="flight"
        active={active === 'flights'}
        onPress={() => navigation.navigate('FlightTracking')}
      />
      <TouchableOpacity
        style={styles.qrWrapper}
        onPress={() => navigation.navigate('Payments')}
        activeOpacity={0.8}
      >
        <View style={styles.qrButton}>
          <MaterialIcons name="qr-code-2" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
      <NavItem
        label="Services"
        icon="map"
        active={active === 'services'}
        onPress={() => navigation.navigate('AirportServices')}
      />
      <NavItem
        label="Profil"
        icon="person"
        active={active === 'profile'}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

interface NavItemProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
  onPress: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, active, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons
        name={icon}
        size={24}
        color={active ? colors.primary : colors.textSecondary}
      />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#111418EE',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#293038',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  label: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(19,127,236,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#111418',
  },
});

export default BottomNav;
