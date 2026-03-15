import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Visit } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VisitList'>;
};

const VisitCard = ({ visit, navigation, onRetry }: { visit: Visit, navigation: any, onRetry: () => void }) => {
  const isFailed = visit.syncStatus === 'Failed';

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Synced': return { bg: '#dcfce7', text: '#166534', dot: '#22c55e' };
      case 'Draft': return { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
      case 'Syncing': return { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' };
      case 'Failed': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
    }
  };

  const colors = getStatusColor(visit.syncStatus);
  const summaryText = visit.aiSummary?.meetingSummary || visit.rawNotes || 'No notes provided.';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('VisitDetails', { visitId: visit.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{visit.customerName}</Text>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <View style={[styles.badgeDot, { backgroundColor: colors.dot }]} />
          <Text style={[styles.badgeText, { color: colors.text }]}>{visit.syncStatus}</Text>
        </View>
      </View>
      
      <Text style={styles.cardDate}>{visit.visitDate} • {visit.visitTime}</Text>
      
      <Text style={styles.cardSummary} numberOfLines={2}>
        {summaryText}
      </Text>

      {isFailed && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>RETRY SYNC</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.deleteCardBtn} 
        onPress={(e) => {
          e.stopPropagation();
          Alert.alert("Delete Visit", "Permanently remove this log?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => useStore.getState().deleteVisit(visit.id) }
          ]);
        }}
      >
        <Text style={styles.deleteCardIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const VisitListScreen = ({ navigation }: Props) => {
  const visits = useStore(state => state.visits);
  const retrySync = useStore(state => state.retrySync);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisits = visits.filter(v => 
    v.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.visitDate.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Visits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SyncSettings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search customers or dates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList 
        data={filteredVisits}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <VisitCard visit={item} navigation={navigation} onRetry={() => retrySync(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No visits found. Create one!</Text>}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateEditVisit', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827' },
  settingsIcon: { fontSize: 24 },
  searchContainer: { backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12 },
  searchInput: { height: 40, fontSize: 15, color: '#111827' },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  badgeText: { fontSize: 12, fontWeight: '500' },
  cardDate: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  cardSummary: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  retryButton: { marginTop: 12 },
  retryText: { color: '#2563eb', fontSize: 13, fontWeight: '700' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  fabText: { color: '#ffffff', fontSize: 32, fontWeight: '300', marginTop: -4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6b7280', fontSize: 16 },
  deleteCardBtn: { 
    position: 'absolute', 
    bottom: 12, 
    right: 12, 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#fee2e2', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca'
  },
  deleteCardIcon: { fontSize: 14, color: '#ef4444' }
});

export default VisitListScreen;
