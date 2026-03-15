import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SyncSettings'>;
};

const SyncSettingsScreen = ({ navigation }: Props) => {
  const store = useStore();
  const visits = store.visits;
  const unsyncedCount = visits.filter(v => ['Draft', 'Failed'].includes(v.syncStatus)).length;
  const isUnsynced = unsyncedCount > 0;
  
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    await store.syncAll();
    setIsSyncing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => {
        store.logout();
      }, style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sync & Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.syncCard}>
          <Text style={styles.sectionTitleLabel}>SYNC STATUS</Text>
          <View style={styles.syncStatusRow}>
            <View style={[styles.statusDot, { backgroundColor: isUnsynced ? '#f97316' : '#22c55e' }]} />
            <Text style={styles.syncStatusText}>{isUnsynced ? 'Unsynced' : 'Synced'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pending Items</Text>
              <Text style={styles.statValue}>{unsyncedCount} Items</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Local Storage</Text>
              <Text style={styles.statValue}>42.8 MB</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.syncButton} onPress={handleSyncAll} disabled={isSyncing || !isUnsynced}>
            <Text style={styles.syncButtonText}>{isSyncing ? 'Syncing...' : 'Sync All Now'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>UTILITY & CACHE</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert("Cache Cleared", "Temporary data and image cache have been removed.")}
          >
            <View style={styles.menuIconBox}><Text>🗑️</Text></View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Clear Cache</Text>
              <Text style={styles.menuSubtitle}>Removes temporary data files</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert("Storage Manager", "Local Storage usage: 42.8 MB\n- Database: 1.2 MB\n- Assets: 41.6 MB")}
          >
            <View style={styles.menuIconBox}><Text>🗄️</Text></View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Storage Management</Text>
              <Text style={styles.menuSubtitle}>View detailed breakdown</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconBox, { backgroundColor: '#fee2e2' }]}><Text>🚪</Text></View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: '#ef4444' }]}>Logout</Text>
              <Text style={[styles.menuSubtitle, { color: '#f87171' }]}>Securely sign out of your account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>App Version 2.4.1 (Build 108)\nLast Synced: Today at 09:42 AM</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  closeIcon: { fontSize: 24, color: '#3b82f6' },
  content: { padding: 16 },
  syncCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitleLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  syncStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  syncStatusText: { fontSize: 24, fontWeight: '700', color: '#111827' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
  statLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111827' },
  syncButton: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  syncButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8, paddingHorizontal: 4 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 },
  menuSubtitle: { fontSize: 13, color: '#6b7280' },
  chevron: { color: '#9ca3af', fontSize: 20 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginLeft: 72 },
  versionText: { textAlign: 'center', color: '#9ca3af', fontSize: 12, lineHeight: 18, marginTop: 20 }
});

export default SyncSettingsScreen;
