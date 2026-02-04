
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAIAdvice = async (query: string) => {
  if (!API_KEY) return "Tanpri konfigire yon API Key pou w ka pale ak Doktè Fèy AI.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `Ou se "Doktè Fèy AI", yon ekspè nan medsin tradisyonèl Ayisyen ak plant medisinal Ayiti. 
        Moun yo ap vin mande w konsèy sou maladi ak plant. 
        Toujou reponn an Kreyòl Ayisyen. 
        Toujou kòmanse ak yon avètisman ke ou se yon AI epi yo dwe wè yon doktè reyèl si ka a grav. 
        Bay enfòmasyon sou fason pou prepare remèd yo selon kilti Ayisyen (bouyi, tranpe, elatriye).`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Padon, mwen pa ka reponn kounye a. Eseye ankò pita.";
  }
};

export const identifyPlantFromImage = async (base64Data: string, mimeType: string) => {
  if (!API_KEY) return "Tanpri konfigire yon API Key.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Ou se yon ekspè nan botanik ak plant medisinal Ayisyen. 
          Idantifye plant ki nan foto sa a. 
          Bay non li an Kreyòl, non syantifik li, epi di pou kisa li bon nan medsin tradisyonèl Ayisyen. 
          Si se pa yon plant, di sa tou. 
          Toujou raple moun yo pou yo fè atansyon. 
          Reponn an Kreyòl Ayisyen sèlman.`,
        },
      ],
    });
    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    return "Mwen pa t ka idantifye plant sa a. Asire w foto a klè epi eseye ankò.";
  }
};
