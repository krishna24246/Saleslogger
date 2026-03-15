import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Visit } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateEditVisit'>;
  route: RouteProp<RootStackParamList, 'CreateEditVisit'>;
};

const CreateEditVisitScreen = ({ navigation, route }: Props) => {
  const { visitId } = route.params;
  const { visits, addVisit, updateVisit } = useStore();
  
  const existingVisit = visits.find(v => v.id === visitId);

  const [customerName, setCustomerName] = useState(existingVisit?.customerName || '');
  const [contactPerson, setContactPerson] = useState(existingVisit?.contactPerson || '');
  const [location, setLocation] = useState(existingVisit?.location || '');
  
  const initialDate = existingVisit ? new Date(existingVisit.visitDate) : new Date();
  if (isNaN(initialDate.getTime())) initialDate.setTime(new Date().getTime()); 
  
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [rawNotes, setRawNotes] = useState(existingVisit?.rawNotes || '');
  const [outcomeStatus, setOutcomeStatus] = useState<Visit['outcomeStatus']>(existingVisit?.outcomeStatus || 'Pending');
  const [followUpDate, setFollowUpDate] = useState(existingVisit?.followUpDate || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Required';
    if (!contactPerson.trim()) newErrors.contactPerson = 'Required';
    if (!location.trim()) newErrors.location = 'Required';
    if (!rawNotes.trim()) newErrors.rawNotes = 'Required';
    if (outcomeStatus === 'Follow-up Needed' && !followUpDate.trim()) {
      newErrors.followUpDate = 'Required when follow-up needed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const visitData: Partial<Visit> = {
      customerName,
      contactPerson,
      location,
      visitDate: date.toLocaleDateString(),
      visitTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawNotes,
      outcomeStatus,
      followUpDate: outcomeStatus === 'Follow-up Needed' ? followUpDate : undefined,
      syncStatus: 'Draft'
    };

    if (existingVisit && existingVisit.rawNotes !== rawNotes) {
      visitData.aiSummary = undefined;
    }

    if (visitId) {
      updateVisit(visitId, visitData);
    } else {
      addVisit({
        ...visitData as Visit,
        id: uuidv4(),
      } as Visit);
    }

    navigation.goBack();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Log</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerBtnText, styles.saveText]}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CUSTOMER DETAILS</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name</Text>
              <TextInput 
                style={[styles.input, errors.customerName && styles.inputError]}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Acme Corp"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person</Text>
              <TextInput 
                style={[styles.input, errors.contactPerson && styles.inputError]}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="John Doe"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.iconInputContainer}>
                <TextInput 
                  style={[styles.input, { flex: 1 }, errors.location && styles.inputError]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Office / Site Address"
                />
                <Text style={styles.inputIcon}>📍</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TIMING & OUTCOME</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visit Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity style={styles.dateTimeField} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
                  <Text style={styles.inputIcon}>📅</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateTimeField} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.dateTimeText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <Text style={styles.inputIcon}>🕒</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                is24Hour={false}
                onChange={onChangeTime}
              />
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Outcome Status</Text>
              <View style={styles.pickerContainer}>
                {['Pending', 'Follow-up Needed', 'Closed'].map((status) => (
                  <TouchableOpacity 
                    key={status}
                    style={[
                      styles.pickerItem, 
                      outcomeStatus === status && styles.pickerItemActive
                    ]}
                    onPress={() => setOutcomeStatus(status as any)}
                  >
                    <Text style={[
                      styles.pickerText, 
                      outcomeStatus === status && styles.pickerTextActive
                    ]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {outcomeStatus === 'Follow-up Needed' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Next Follow-up Date</Text>
                <TouchableOpacity style={styles.iconInputContainer} onPress={() => setShowDatePicker(true)}>
                  <Text style={[styles.input, { flex: 1, paddingVertical: 14 }]}>{followUpDate || 'Select Date'}</Text>
                  <Text style={styles.inputIcon}>📅</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RAW MEETING NOTES</Text>
            <TextInput 
              style={[styles.textArea, errors.rawNotes && styles.inputError]}
              value={rawNotes}
              onChangeText={setRawNotes}
              placeholder="Type or dictate notes here..."
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Submit Visit Log</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    height: 56, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerBtnText: { fontSize: 16, color: '#3b82f6' },
  saveText: { fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  section: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 16, letterSpacing: 0.5 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 16, height: 48, fontSize: 15, color: '#111827' },
  iconInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingRight: 12 },
  inputIcon: { fontSize: 18, color: '#9ca3af' },
  textArea: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, minHeight: 120, fontSize: 15, color: '#111827' },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  pickerItemActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pickerText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  pickerTextActive: { color: '#ffffff' },
  inputError: { borderColor: '#ef4444' },
  submitButton: { backgroundColor: '#2563eb', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  dateTimeRow: { flexDirection: 'row', gap: 12 },
  dateTimeField: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, height: 48 },
  dateTimeText: { fontSize: 15, color: '#111827' }
});

export default CreateEditVisitScreen;
