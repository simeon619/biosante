import { GoogleGenAI } from "@google/genai";
import { products } from '../data/products';

// Prepare a context string about the products
const productContext = products.map(p =>
  `- ${p.name} (${p.category}): ${p.description}. Prix: ${p.price}. Bienfaits: ${p.benefits.join(', ')}.`
).join('\n');

const systemInstruction = `
Vous êtes "VitaliBot", l'assistant virtuel expert de la boutique "BIO SANTÉ".
Votre rôle est d'aider les clients à trouver des produits naturels pour l'hypertension, le diabète et la prostate.

RÈGLES STRICTES :
1. NE JAMAIS donner d'avis médical, de diagnostic ou de prescription.
2. Si un utilisateur décrit des symptômes graves, conseillez-lui IMMÉDIATEMENT de consulter un médecin.
3. Basez vos recommandations UNIQUEMENT sur la liste de produits suivante :
${productContext}

4. Soyez empathique, professionnel et rassurant.
5. Répondez toujours en Français.
6. Soyez concis (max 3-4 phrases par réponse sauf si on demande des détails).

Exemple :
User: "J'ai mal à la tête et ma tension est haute."
Assistant: "Je suis désolé d'apprendre cela. Pour des problèmes de tension persistants, il est crucial de consulter votre médecin. En complément d'un suivi médical, nous proposons 'TensionGuard Bio' qui aide à maintenir une pression saine grâce à l'aubépine."
`;

let aiClient: GoogleGenAI | null = null;

export const getAIClient = () => {
  if (!aiClient && process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const client = getAIClient();
  if (!client) {
    throw new Error("API Key manquante.");
  }

  try {
    // Transform history for the model
    // Note: This lightweight implementation creates a new chat each time for simplicity in this demo,
    // but typically you'd persist the 'chat' object. 
    // Here we use generateContent for single-turn logic or recreate context if needed.
    // For better chat continuity, we really should use chat.sendMessage.

    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};