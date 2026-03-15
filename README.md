# Sales AI - AI-Assisted Sales Visit Logger

A premium mobile application for field sales reps to log customer visits, manage offline data, and generate AI-assisted meeting summaries.

## 🚀 Key Features
- **Smart Logging**: Quickly record visit details with location and contact info.
- **AI Summaries**: Automatically generate structured summaries (meeting notes, pain points, action items) from raw notes.
- **Offline First**: Full functionality without internet. Data persists locally using AsyncStorage.
- **Seamless Sync**: Robust sync mechanism with manual retry and status indicators (Draft, Syncing, Synced, Failed).
- **Modern UI**: High-fidelity, premium design system built with custom styles.

## 🛠 Tech Stack
- **Framework**: React Native CLI
- **Language**: TypeScript
- **State & Persistence**: Zustand + AsyncStorage
- **Navigation**: React Navigation
- **Architecture**: Service-oriented with mock AI integration.

## 📋 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Android Studio / Xcode
- React Native environment (Cocoapods for iOS)

### Installation
1. Navigate to the project directory:
   ```bash
   cd SalesLoggerApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run on Android:
   ```bash
   npx react-native run-android
   ```
4. Run on iOS (macOS required):
   ```bash
   npx react-native run-ios
   ```

## 📂 Project Structure
- `/src/store`: State management via Zustand.
- `/src/screens`: All feature screens (Login, Dashboard, Visit Details, etc.).
- `/src/services`: External integrations (Mock AI service).
- `/src/navigation`: App routing configuration.
- `/src/types`: TypeScript definitions.

## 💡 AI Implementation
The app simulates a connection to an AI LLM via a dedicated service. It analyzes raw meeting notes to extract key insights, demonstrating how real-world AI agents can assist sales professionals in real-time.
