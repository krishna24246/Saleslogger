# SalesLoggerApp Architecture Note

## Data Flow
The application follows a unidirectional data flow powered by **Zustand**. 
- **Actions**: Screens dispatch actions (e.g., `addVisit`, `updateVisit`, `syncAll`) to the store.
- **State**: The store maintains the global state (`user`, `visits`).
- **Persistence**: `AsyncStorage` is used via Zustand's persist middleware to ensure data survives app restarts.
- **UI Update**: Components subscribe to specific parts of the store and re-render when the relevant state changes.

## Local Persistence Approach
- **Tool**: `@react-native-async-storage/async-storage`.
- **Implementation**: Wrapped within the Zustand store using the `persist` middleware. This automatically serializes the visits array to local storage whenever it changes.

## Sync Approach
- **Status Management**: Each visit has a `syncStatus` field (`Draft`, `Syncing`, `Synced`, `Failed`).
- **Simulated Sync**: The `syncAll` method in the store iterates through unsynced items, sets them to `Syncing`, waits for a simulated network delay, and then either marks them as `Synced` or `Failed` based on a random factor to demonstrate retry logic.
- **Manual Retry**: Users can tap "RETRY SYNC" on failed items in the dashboard or details screen.

## AI Integration Approach
- **Service**: `GeminiService.ts` integrates with Google's Gemini 1.5 Flash model.
- **Trigger**: When a visit detail screen is opened and no AI summary exists, the service is called with the `rawNotes`.
- **Response**: The AI processes raw meeting notes into a structured JSON object containing `meetingSummary`, `painPoints`, `actionItems`, and `recommendedNextStep`.
- **Storage**: The generated summary is saved back into the visit object in the store.

## Tools Used
- **React Native CLI**: Core framework.
- **Zustand**: State management and persistence.
- **React Navigation**: Multi-screen routing.
- **UUID**: Unique ID generation for local-first creation.
- **Lucide Icons (Simulated with Emojis/Styling)**: For visual cues.

## Manual Corrections from AI Code
- **Validation**: Refined the conditional validation for "Next Follow-up Date" to ensure it's only required when "Follow-up Needed" is selected.
- **Persistence Config**: Explicitly configured `createJSONStorage` for compatibility with React Native's async nature.
- **UI Alignment**: Adjusted Stylings to match the "Premium" feel requested, using specific hex codes and spacing from the provided screen designs.
