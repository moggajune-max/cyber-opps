
import { GoogleGenAI, Type } from "@google/genai";
import { ScienceFact } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const OFFLINE_INTEL: ScienceFact[] = [
  {
    topic: "Hypersonic Flight",
    fact: "Hypersonic vehicles travel at Mach 5 or faster—more than 3,800 miles per hour. This requires advanced heat shielding to survive extreme air friction.",
    category: 'Aerodynamics',
    funEmoji: '💨',
    threatLevel: 'High'
  },
  {
    topic: "Neural Networks",
    fact: "Modern AI uses 'Deep Learning' which is inspired by how human brains process signals. This allows drones to recognize obstacles in real-time.",
    category: 'Future Warfare',
    funEmoji: '🧠',
    threatLevel: 'Medium'
  },
  {
    topic: "Quantum Cryptography",
    fact: "Quantum encryption uses the laws of physics to protect data. If someone tries to spy on a quantum key, the signal physically changes, alerting the owner.",
    category: 'Digital Encryption',
    funEmoji: '🔐',
    threatLevel: 'Extreme'
  },
  {
    topic: "Composite Armor",
    fact: "Modern vehicle protection uses layers of ceramics and steel. Ceramics break down the force of a projectile, while steel catches the fragments.",
    category: 'Tactical Hardware',
    funEmoji: '🛡️',
    threatLevel: 'Low'
  },
  {
    topic: "Lidar Navigation",
    fact: "Lidar sends out millions of laser pulses per second to create a 3D map of the environment, allowing vehicles to see through smoke and dust.",
    category: 'Tactical Hardware',
    funEmoji: '🔦',
    threatLevel: 'Medium'
  }
];

export const fetchScienceFact = async (topicType: string): Promise<ScienceFact> => {
  // If no internet or API key, return a random offline fact immediately
  if (!navigator.onLine || !process.env.API_KEY) {
    return OFFLINE_INTEL[Math.floor(Math.random() * OFFLINE_INTEL.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 'Tactical Intelligence Briefing' for a commander about the real-world science or technology behind: ${topicType}. 
      Make it sound like a modern combat intel report. Use STEM principles (physics, engineering, tech). Keep it professional but exciting for kids.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            fact: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Tactical Hardware', 'Future Warfare', 'Aerodynamics', 'Digital Encryption'] },
            funEmoji: { type: Type.STRING },
            threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Extreme'] }
          },
          required: ["topic", "fact", "category", "funEmoji", "threatLevel"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ScienceFact;
  } catch (error) {
    console.error("API Error, falling back to local intel:", error);
    return OFFLINE_INTEL[Math.floor(Math.random() * OFFLINE_INTEL.length)];
  }
};
