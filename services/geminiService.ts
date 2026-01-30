
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

export const getSmartNotification = async (
  taskTitle: string, 
  status: string, 
  isOverdue: boolean,
  isNearDeadline: boolean,
  language: 'pt' | 'en'
): Promise<string> => {
  try {
    const prompt = `
      Task: "${taskTitle}"
      Current Status: ${status}
      Is Overdue: ${isOverdue}
      Is Near Deadline: ${isNearDeadline}
      Language: ${language}

      Act as a task management assistant. Generate a single-sentence notification message.
      If it's overdue, use a firm but professional tone (urgent).
      If it's near deadline, use a motivating tone.
      If it's just a status change, use an informative tone.
      Return ONLY the message text.
    `;

    // Use gemini-3-flash-preview for the notification generation task.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the .text property directly as per the guidelines.
    return response.text?.trim() || "Notification update.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'pt' ? "Atualização na tarefa." : "Task update.";
  }
};
