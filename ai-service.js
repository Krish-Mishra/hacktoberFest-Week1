import { ChatGoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@langchain/google-genai@0.0.12/+esm";
import { PromptTemplate } from "https://cdn.jsdelivr.net/npm/@langchain/core@0.1.62/prompts/+esm";
import { StructuredOutputParser } from "https://cdn.jsdelivr.net/npm/@langchain/core@0.1.62/output_parsers/+esm";

/**
 * AI Service using LangChain.js
 * 
 * Why LangChain?
 * By using LangChain for orchestration, we decouple our application logic from 
 * the specific LLM provider. Here, we use Google Gemini via AI Studio, but 
 * because we use Chat Models and PromptTemplates, swapping this out for a local 
 * open-weight model (like Llama 3 via Ollama) in the future is trivial.
 * You would simply replace `ChatGoogleGenerativeAI` with `ChatOllama`.
 * This paves the way for a fully offline capability later.
 */

// Initialize the Chat Model
// Note: In a production environment, API keys should be handled securely on a backend.
// This is exposed here purely for this specific Hacktoberfest challenge environment.
// We use a global CONFIG object loaded from config.js
const llm = new ChatGoogleGenerativeAI({
  apiKey: CONFIG.GEMINI_API_KEY,
  model: "gemini-3.5-flash-lite",
  modelName: "gemini-3.5-flash-lite",
  temperature: 0.7,
});

// Define the structured JSON output schema we want
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  title: "A catchy, short title for the mission.",
  description: "A brief setup description (1-2 sentences).",
  steps: "An array of 3-5 specific, sensory-based steps as strings."
});

// Define the prompt template
const promptTemplate = new PromptTemplate({
  template: `You are an expert outdoor guide. Generate a strictly screen-free mindful mission for someone to do outside.
Do not require the user to use their phone to take photos, scan things, or read facts during the activity. 
The steps must rely solely on physical senses (sight, touch, hearing).

Context:
- Environment: {environment}
- Time Available: {time} minutes
- Vibe: {vibe}

{format_instructions}
`,
  inputVariables: ["environment", "time", "vibe"],
  partialVariables: { format_instructions: parser.getFormatInstructions() }
});

/**
 * Generates a mindful mission based on user inputs.
 * @param {string} environment 
 * @param {number} time 
 * @param {string} vibe 
 * @returns {Promise<Object>} The generated mission data
 */
export async function generateMission(environment, time, vibe) {
  try {
    // 1. Format the prompt with inputs
    const formattedPrompt = await promptTemplate.format({
      environment,
      time,
      vibe
    });

    // 2. Call the LLM
    const response = await llm.invoke(formattedPrompt);

    // 3. Parse the output into our expected JSON structure
    const parsedOutput = await parser.parse(response.content);
    
    // Convert stringified steps array into an actual array to prevent .forEach() error in app.js
    if (typeof parsedOutput.steps === 'string') {
      try {
        parsedOutput.steps = JSON.parse(parsedOutput.steps);
      } catch (e) {
        // Fallback: split by newline if it's just a raw text list
        parsedOutput.steps = parsedOutput.steps.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      }
    }
    
    return parsedOutput;
  } catch (error) {
    console.error("Error in AI Service:", error);
    throw error;
  }
}
