import { Source } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const askLibrarian = async (query: string): Promise<{ text: string; sources: Source[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/librarian/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from librarian');
    }

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_BASE_URL}/speech/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};
