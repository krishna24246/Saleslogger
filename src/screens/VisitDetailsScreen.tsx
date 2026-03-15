import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useStore } from '../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { generateAISummary } from '../services/GeminiService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VisitDetails'>;
  route: RouteProp<RootStackParamList, 'VisitDetails'>;
};

const VisitDetailsScreen = ({ navigation, route }: Props) => {
  const { visitId } = route.params;
  const { visits, updateVisit, retrySync } = useStore();
  const visit = visits.find(v => v.id === visitId);

  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerateAI = useCallback(async () => {
    if (!visit) return;
    setLoadingAI(true);
    try {
      const summary = await generateAISummary(visit.rawNotes);
      updateVisit(visitId, { aiSummary: summary });
    } catch {
      Alert.alert("Error", "Failed to generate AI summary");
    } finally {
      setLoadingAI(false);
    }
  }, [visit, visitId, updateVisit]);

  useEffect(() => {
    if (visit && !visit.aiSummary && visit.rawNotes) {
      handleGenerateAI();
    }
  }, [visit, handleGenerateAI]);

  if (!visit) {
    return (
      <View style={styles.center}>
        <Text>Visit not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => retrySync(visitId)} style={styles.headerIcon}>
            <Text>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('CreateEditVisit', { visitId })} 
            style={styles.headerIcon}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert("Delete Visit", "Are you sure you want to delete this log?", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => {
                   useStore.getState().deleteVisit(visitId);
                   navigation.goBack();
                }}
              ]);
            }} 
            style={[styles.headerIcon, styles.deleteAction]}
          >
            <Text style={styles.deleteActionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.visitHeader}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>ON-SITE VISIT</Text>
          </View>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{visit.customerName}</Text>
              <Text style={styles.contactPerson}>Primary Contact: {visit.contactPerson}</Text>
            </View>
            <View style={styles.logoBox}>
               <Text>🏢</Text>
            </View>
          </View>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{visit.visitDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕒</Text>
              <Text style={styles.metaText}>{visit.visitTime} (45m)</Text>
            </View>
          </View>
        </View>

        <View style={styles.aiHeader}>
           <View style={styles.aiIconBox}><Text>⚡</Text></View>
           <Text style={styles.aiTitle}>AI Summary</Text>
        </View>

        {loadingAI ? (
          <View style={styles.aiPlaceholder}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.aiLoadingText}>Generating AI Summary...</Text>
          </View>
        ) : visit.aiSummary ? (
          <View style={styles.aiContainer}>
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>MEETING SUMMARY</Text>
              <Text style={styles.summaryContent}>{visit.aiSummary.meetingSummary}</Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={[styles.summaryLabel, { color: '#ef4444' }]}>KEY PAIN POINTS</Text>
              {visit.aiSummary.painPoints.map((point, i) => (
                <View key={i} style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summarySection}>
              <Text style={[styles.summaryLabel, { color: '#10b981' }]}>ACTION ITEMS</Text>
              {visit.aiSummary.actionItems.map((item, i) => (
                <View key={i} style={styles.checkItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationLabel}>RECOMMENDED NEXT STEP</Text>
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationIcon}><Text>➔</Text></View>
                <Text style={styles.recommendationText}>{visit.aiSummary.recommendedNextStep}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.aiPlaceholder}>
             <Text style={styles.aiLoadingText}>No AI summary generated.</Text>
             <TouchableOpacity onPress={handleGenerateAI} style={styles.retryAIBtn}>
                <Text style={styles.retryAIText}>Generate Now</Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerBtn} 
          onPress={() => Alert.alert("Success", "Call logged successfully.")}
        >
          <Text style={styles.footerBtnText}>Log Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerBtn, styles.primaryFooterBtn]}
          onPress={() => Alert.alert("Task Created", "A follow-up task has been added to your queue.")}
        >
          <Text style={styles.primaryFooterBtnText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backIcon: { fontSize: 24, color: '#374151' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 16 },
  deleteAction: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  deleteActionText: { fontSize: 14, color: '#ef4444' },
  container: { flex: 1 },
  visitHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
  typeBadgeText: { fontSize: 11, fontWeight: '700', color: '#2563eb' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  customerName: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  contactPerson: { fontSize: 15, color: '#6b7280' },
  logoBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#1e3a3a', alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', gap: 24 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { fontSize: 16, marginRight: 8 },
  metaText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 0 },
  aiIconBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  aiPlaceholder: { padding: 40, alignItems: 'center' },
  aiLoadingText: { marginTop: 12, color: '#6b7280', fontSize: 14 },
  aiContainer: { padding: 20 },
  summarySection: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6' },
  summaryLabel: { fontSize: 11, fontWeight: '800', color: '#4f46e5', marginBottom: 12, letterSpacing: 0.5 },
  summaryContent: { fontSize: 15, color: '#374151', lineHeight: 22 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { width: 5, height: 5, borderRadius: 2.5, marginRight: 10 },
  bulletText: { fontSize: 15, color: '#374151', flex: 1 },
  checkItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db', marginRight: 10 },
  recommendationBox: { backgroundColor: '#eef2ff', borderRadius: 16, padding: 16 },
  recommendationLabel: { fontSize: 11, fontWeight: '800', color: '#4f46e5', marginBottom: 12 },
  recommendationContent: { flexDirection: 'row', alignItems: 'center' },
  recommendationIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  recommendationText: { fontSize: 15, color: '#2563eb', fontWeight: '600', flex: 1 },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  footerBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  primaryFooterBtn: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  primaryFooterBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  retryAIBtn: { marginTop: 12, padding: 8 },
  retryAIText: { color: '#4f46e5', fontWeight: '700' }
});

export default VisitDetailsScreen;
