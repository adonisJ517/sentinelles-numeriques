import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { RootStackParamList } from './BottomNav';
import type { NavigationProp, RouteProp } from '@react-navigation/native';

export type AdminBottomNavKey =
  | 'dashboard'
  | 'incidents'
  | 'airlines'
  | 'content'
  | 'users'
  | 'payments';

interface AdminBottomNavProps {
  active: AdminBottomNavKey;
  userParam?: RootStackParamList['AdminDashboard'];
}

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ active, userParam }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = userParam?.user;

  return (
    <View style={styles.container}>
      <NavItem
        label="Dashboard"
        icon="dashboard"
        active={active === 'dashboard'}
        onPress={() => navigation.navigate('AdminDashboard', { user })}
      />
      <NavItem
        label="Incidents"
        icon="warning"
        active={active === 'incidents'}
        onPress={() => navigation.navigate('AdminIncidents', { user })}
      />
      <NavItem
        label="Vols"
        icon="flight-takeoff"
        active={active === 'airlines'}
        onPress={() => navigation.navigate('AdminAirlines', { user })}
      />
      <NavItem
        label="Contenus"
        icon="article"
        active={active === 'content'}
        onPress={() => navigation.navigate('AdminContent', { user })}
      />
      <NavItem
        label="Utilisateurs"
        icon="groups"
        active={active === 'users'}
        onPress={() => navigation.navigate('AdminUsers', { user })}
      />
      <NavItem
        label="Paiements"
        icon="payments"
        active={active === 'payments'}
        onPress={() => navigation.navigate('AdminPayments', { user })}
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
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={icon}
        size={22}
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
    height: 72,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#111418EE',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#293038',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
});

export default AdminBottomNav;
