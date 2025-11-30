import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRandomStudents = async (count: number = 3): Promise<Partial<Student>[]> => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} Gen Z style high school student profiles (approx age 15-18) with diverse names, grades (e.g., 10-A, 11-Science, 12-Commerce), and class roll numbers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              rollNumber: { type: Type.STRING },
              grade: { type: Type.STRING },
            },
            required: ["name", "rollNumber", "grade"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data;
    }
    return [];
  } catch (error) {
    console.error("Failed to generate students:", error);
    return [];
  }
};

export const extractStudentFromIDCard = async (base64Image: string): Promise<Partial<Student> | null> => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this school ID card image. Extract the student details into JSON format. If a field is not visible, leave it empty. Infer the Grade/Class if possible (e.g. 'X' or '10' becomes '10'). Split Grade and Section if combined (e.g. '10-A')."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             name: { type: Type.STRING },
             rollNumber: { type: Type.STRING },
             grade: { type: Type.STRING },
             section: { type: Type.STRING },
             parentName: { type: Type.STRING },
             parentContact: { type: Type.STRING },
             dob: { type: Type.STRING },
             address: { type: Type.STRING },
             bloodGroup: { type: Type.STRING }
           }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("OCR Failed:", error);
    return null;
  }
};