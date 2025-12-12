import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
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

type ContentType = 'REGLE' | 'ANNONCE' | 'PROMO';

type ContentStatus = 'ACTIF' | 'INACTIF' | 'ARCHIVE';

interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  subtitle: string;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

const API_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const CONTENT_API_URL = `${API_HOST}/api/contents`;

const TABS: { key: 'TOUT' | 'REGLES' | 'ANNONCES' | 'PROMOS'; label: string }[] = [
  { key: 'TOUT', label: 'Tout' },
  { key: 'REGLES', label: 'Règles' },
  { key: 'ANNONCES', label: 'Annonces' },
  { key: 'PROMOS', label: 'Promos' },
];

const AdminContentScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AdminContent'>>();
  const navigation = useNavigation();
  const nav: any = navigation;
  const user: AuthUser | undefined = route.params?.user;

  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('TOUT');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState<{
    type: ContentType;
    title: string;
    subtitle: string;
    status: ContentStatus;
  }>({
    type: 'ANNONCE',
    title: '',
    subtitle: '',
    status: 'ACTIF',
  });

  const displayName =
    (user?.fullName && user.fullName.trim().split(' ')[0]) || 'Admin';

  const fetchContents = async (opts?: { silent?: boolean }) => {
    try {
      if (opts?.silent) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch(CONTENT_API_URL);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erreur lors du chargement des contenus (${response.status})`);
      }
      const data = (await response.json()) as ContentItem[];
      setItems(data);
    } catch (e) {
      console.error('Erreur API (contents):', e);
      setError(e instanceof Error ? e.message : 'Impossible de charger les contenus.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const refreshAll = async () => {
    if (isLoading) return;
    await fetchContents({ silent: true });
  };

  const handleCreate = async () => {
    if (!newItem.title.trim() || !newItem.subtitle.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner un titre et une description.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(CONTENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newItem.type,
          title: newItem.title.trim(),
          subtitle: newItem.subtitle.trim(),
          status: newItem.status,
        }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du contenu');
      }

      setShowCreateModal(false);
      setNewItem({ type: 'ANNONCE', title: '', subtitle: '', status: 'ACTIF' });
      await fetchContents();
      Alert.alert('Succès', 'Contenu ajouté.');
    } catch (e) {
      console.error('Erreur API (create content):', e);
      Alert.alert('Erreur', "Impossible d'ajouter le contenu.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContent = useMemo(() => {
    if (tab === 'TOUT') return items;
    if (tab === 'REGLES') return items.filter((c) => c.type === 'REGLE');
    if (tab === 'ANNONCES') return items.filter((c) => c.type === 'ANNONCE');
    if (tab === 'PROMOS') return items.filter((c) => c.type === 'PROMO');
    return items;
  }, [tab, items]);

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
        <Modal
          visible={showCreateModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCreateModal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Ajouter un contenu</Text>
                    <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                      <MaterialIcons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Type</Text>
                      <View style={styles.chipRow}>
                        {([
                          { key: 'REGLE', label: 'Règle' },
                          { key: 'ANNONCE', label: 'Annonce' },
                          { key: 'PROMO', label: 'Promo' },
                        ] as const).map((t) => (
                          <TouchableOpacity
                            key={t.key}
                            style={[
                              styles.chip,
                              newItem.type === t.key && styles.chipActive,
                            ]}
                            onPress={() => setNewItem((p) => ({ ...p, type: t.key }))}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                newItem.type === t.key && styles.chipTextActive,
                              ]}
                            >
                              {t.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Titre</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: Travaux Terminal 2"
                        placeholderTextColor={colors.textSecondary}
                        value={newItem.title}
                        onChangeText={(text) => setNewItem((p) => ({ ...p, title: text }))}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Description</Text>
                      <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Ex: Retards prévus aux portes B12-B15"
                        placeholderTextColor={colors.textSecondary}
                        value={newItem.subtitle}
                        onChangeText={(text) => setNewItem((p) => ({ ...p, subtitle: text }))}
                        multiline
                        numberOfLines={4}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Statut</Text>
                      <View style={styles.chipRow}>
                        {([
                          { key: 'ACTIF', label: 'Actif' },
                          { key: 'INACTIF', label: 'Inactif' },
                          { key: 'ARCHIVE', label: 'Archivé' },
                        ] as const).map((s) => (
                          <TouchableOpacity
                            key={s.key}
                            style={[
                              styles.chip,
                              newItem.status === s.key && styles.chipActive,
                            ]}
                            onPress={() => setNewItem((p) => ({ ...p, status: s.key }))}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                newItem.status === s.key && styles.chipTextActive,
                              ]}
                            >
                              {s.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalCancelButton]}
                      onPress={() => setShowCreateModal(false)}
                      disabled={isLoading}
                    >
                      <Text style={styles.modalCancelText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.modalSubmitButton,
                        isLoading && styles.modalButtonDisabled,
                      ]}
                      onPress={handleCreate}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.modalSubmitText}>Ajouter</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconCircle} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTexts}>
            <Text style={styles.headerTitle}>Gestion des contenus</Text>
            <Text style={styles.headerSubtitle}>Admin {displayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.addActionButton}
            onPress={() => setShowCreateModal(true)}
            disabled={isLoading}
          >
            <MaterialIcons name="add" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerRightIcon}
            onPress={refreshAll}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MaterialIcons name="refresh" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshAll}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderLeftColor: '#f97316' }] }>
              <View style={styles.statIconWrapperWarning}>
                <MaterialIcons name="warning" size={20} color="#f97316" />
              </View>
              <Text style={styles.statValue}>
                {items.filter((i) => i.type === 'ANNONCE' && i.status === 'ACTIF').length}
              </Text>
              <Text style={styles.statLabel}>Alertes actives</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrapperPrimary}>
                <MaterialIcons name="campaign" size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {items.filter((i) => i.type === 'ANNONCE').length}
              </Text>
              <Text style={styles.statLabel}>Annonces</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrapperGreen}>
                <MaterialIcons name="local-offer" size={20} color="#22c55e" />
              </View>
              <Text style={styles.statValue}>
                {items.filter((i) => i.type === 'PROMO').length}
              </Text>
              <Text style={styles.statLabel}>Promos</Text>
            </View>
          </View>

          <View style={styles.tabsWrapper}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tabButton,
                  tab === t.key && styles.tabButtonActive,
                ]}
                onPress={() => setTab(t.key)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    tab === t.key && styles.tabLabelActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>Récents</Text>
            <Text style={styles.listLink}>Voir tout</Text>
          </View>

          <TouchableOpacity
            style={styles.addContentButton}
            onPress={() => setShowCreateModal(true)}
          >
            <MaterialIcons name="add" size={18} color={colors.white} />
            <Text style={styles.addContentButtonText}>Ajouter (règle / annonce / promo)</Text>
          </TouchableOpacity>

          {isLoading && items.length === 0 ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.loadingBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchContents}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredContent.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  item.status === 'ARCHIVE' && styles.itemCardInactive,
                ]}
              >
                <View style={styles.itemIconWrapper}>
                  <MaterialIcons
                    name={
                      item.type === 'REGLE'
                        ? 'badge'
                        : item.type === 'ANNONCE'
                          ? 'campaign'
                          : 'local-offer'
                    }
                    size={20}
                    color={
                      item.type === 'PROMO'
                        ? '#ec4899'
                        : item.type === 'ANNONCE'
                          ? colors.primary
                          : '#22c55e'
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <TouchableOpacity>
                  <MaterialIcons
                    name="more-vert"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        <AdminBottomNav active="content" userParam={{ user }} />
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
  addActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
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
  statIconWrapperWarning: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(234,179,8,0.1)',
  },
  statIconWrapperPrimary: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(19,127,236,0.1)',
  },
  statIconWrapperGreen: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  statValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabsWrapper: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.surfaceDark,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  listLink: {
    fontSize: 12,
    color: colors.primary,
  },
  addContentButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  addContentButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  itemCardAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  itemCardInactive: {
    opacity: 0.7,
  },
  itemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    marginRight: 10,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 16,
    maxHeight: '85%',
    width: '100%',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  modalTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    borderWidth: 1,
    borderColor: '#1f2937',
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#111827',
  },
  chipActive: {
    backgroundColor: 'rgba(19,127,236,0.18)',
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalSubmitButton: {
    backgroundColor: colors.primary,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalSubmitText: {
    color: colors.white,
    fontWeight: '800',
  },
});

export default AdminContentScreen;
