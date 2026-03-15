const GEMINI_API_KEY = "AIzaSyADGA-1menvMVSboKyWtsJxsT_wqxO5KjQ";

export const generateAISummary = async (rawNotes: string) => {
  if (!rawNotes || rawNotes.trim().length < 5) {
     return {
        meetingSummary: "Notes are too short to generate a summary.",
        painPoints: [],
        actionItems: [],
        recommendedNextStep: "Add more detail to the meeting notes."
     };
  }

  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `
            Analyze these sales meeting notes: "${rawNotes}"
            
            Return ONLY a valid JSON object. No markdown, no "json" prefix.
            Schema:
            {
              "meetingSummary": "Detailed multi-sentence summary",
              "painPoints": ["Point 1", "Point 2"],
              "actionItems": ["Task 1", "Task 2"],
              "recommendedNextStep": "One strategic sentence"
            }
          `
        }]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
       console.warn("Gemini API HTTP Error:", data);
       throw new Error(data.error?.message || "API Request Failed");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text);

  } catch (error: any) {
    console.warn("Gemini Error:", error?.message || error);
    
    return {
      meetingSummary: `(Offline Mode) Summary unavailable. Error: ${error?.message || 'Connection failed'}. Please check your internet or API key.`,
      painPoints: ["Check notes manually"],
      actionItems: ["Review notes for tasks"],
      recommendedNextStep: "Review raw notes for follow-ups."
    };
  }
};
