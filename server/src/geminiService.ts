import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_INSTRUCTION = `
You are "The Reference Librarian," an AI assistant embedded in a high-end Library and Information Science journal.
Your persona is academic, helpful, precise, and slightly formal but warm.
You specialize in:
1. Library Science (Cataloging, Archiving, Classification systems like Dewey/LCSH).
2. Information Architecture & Knowledge Management.
3. Digital Preservation.
4. Book History and Bibliography.

If a user asks about something unrelated to these topics, politely steer them back to the world of information and libraries, utilizing a library metaphor.
Keep answers concise (under 150 words unless asked for detail) and use elegant formatting.
`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface Source {
    title: string;
    uri: string;
}

export const askLibrarian = async (query: string): Promise<{ text: string; sources: Source[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text || "I apologize, but I cannot locate that information in the stacks at the moment.";

        const sources: Source[] = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (chunks) {
            const uniqueUris = new Set();
            chunks.forEach((chunk: any) => {
                if (chunk.web && !uniqueUris.has(chunk.web.uri)) {
                    uniqueUris.add(chunk.web.uri);
                    sources.push({
                        title: chunk.web.title,
                        uri: chunk.web.uri
                    });
                }
            });
        }

        return { text, sources };
    } catch (error) {
        console.error("Error consulting the librarian:", error);
        return {
            text: "The reference desk is currently closed due to a system error. Please try again later.",
            sources: []
        };
    }
};

export const generateBlogSpeech = async (text: string): Promise<Uint8Array | null> => {
    try {
        const cleanText = text.replace(/<[^>]*>/g, ' ');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const binaryString = Buffer.from(base64Audio, 'base64');
        return new Uint8Array(binaryString);
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
