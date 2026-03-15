import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, SafeAreaView } from 'react-native';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [progress] = useState(new Animated.Value(0));
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 500);
    });

    progress.addListener(({ value }) => {
      setPercent(Math.floor(value * 100));
    });

    return () => progress.removeAllListeners();
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Sales <Text style={styles.aiText}>AI</Text></Text>
        <Text style={styles.subtitle}>Professional Visit Logging & Analytics</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Starting up...</Text>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width }]} />
        </View>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, percent > 30 && styles.activeDot]} />
          <View style={[styles.dot, percent > 60 && styles.activeDot]} />
          <View style={[styles.dot, percent > 90 && styles.activeDot]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 40 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { marginBottom: 20 },
  logoImage: { width: 180, height: 180, borderRadius: 30 },
  appName: { fontSize: 48, fontWeight: '800', color: '#111827', marginBottom: 12 },
  aiText: { color: '#ea580c' },
  subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'center' },
  footer: { marginBottom: 40 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressText: { color: '#6b7280', fontSize: 14 },
  percentText: { color: '#ea580c', fontWeight: '700', fontSize: 14 },
  progressBarBg: { height: 6, backgroundColor: '#fff7ed', borderRadius: 3, overflow: 'hidden', marginBottom: 30 },
  progressBarFill: { height: '100%', backgroundColor: '#ea580c' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fed7aa' },
  activeDot: { backgroundColor: '#ea580c' }
});

export default SplashScreen;
