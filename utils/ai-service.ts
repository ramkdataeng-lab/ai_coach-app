import { PersistenceService } from './persistence';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const AI_SYSTEM_PROMPTS = {
    productivity: "You are a ruthless but calm Productivity Coach. You value systems, focus, and deep work. You speak concisely and ask probing questions about the user's blockers.",
    creative: "You are a creative muse. You encourage divergent thinking, unconventional ideas, and artistic expression. You speak in metaphors and inspire the user.",
    systems: "You are a Systems Architect. You see life as a series of interconnected loops. You help the user optimize their workflows and habits. You speak in terms of inputs, outputs, and bottlenecks.",
    default: "You are a minimalist life coach named Nirvan. You help the user find clarity and purpose through simple, direct advice."
};

// OpenAI API Key
// OpenAI API Key
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export const generateAIResponse = async (history: AIMessage[], coachType: string = 'default'): Promise<string> => {
    // Check for Consent FIRST
    const hasConsented = await PersistenceService.getAIConsent();
    if (!hasConsented) {
        throw new Error("AI Consent not granted. Please accept the privacy policy to continue.");
    }

    // Retrieve User Context
    const userContext = await PersistenceService.getUserContext();

    // Construct System Instruction
    let systemInstruction = AI_SYSTEM_PROMPTS[coachType as keyof typeof AI_SYSTEM_PROMPTS];

    if (!systemInstruction) {
        // Check for Custom Coach
        const customCoaches = await PersistenceService.getCustomCoaches();
        const customCoach = customCoaches.find(c => c.id === coachType);
        if (customCoach) {
            systemInstruction = customCoach.systemPrompt;
        } else {
            systemInstruction = AI_SYSTEM_PROMPTS.default;
        }
    }

    if (userContext) {
        const values = userContext.values || 'Not specified';
        const focus = userContext.focus || 'Not specified';
        const name = userContext.name || 'User';
        systemInstruction += `\n\nUSER CONTEXT:\n- Name: ${name}\n- Values: ${values}\n- Current Focus: ${focus}\n\nTailor your advice to align with these values and focus. Address the user as ${name}.`;
    }

    // Build messages for OpenAI
    const messages = [
        {
            role: "system",
            content: systemInstruction
        },
        ...history.map(msg => ({
            role: msg.role,
            content: msg.content
        }))
    ];

    // Call OpenAI API using fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || "I'm having trouble responding right now.";
};

export const generateSystemPrompt = async (name: string, description: string): Promise<{ prompt: string, description: string, icon: string }> => {
    const possibleIcons = [
        "Dumbbell", "Trophy", "Medal", // Sports
        "Palette", "Music", "Camera", // Creative
        "Code", "Cpu", "Globe", // Tech
        "Heart", "Sun", "Coffee", "Leaf", "BookOpen", // Life
        "BrainCircuit", "Zap", "Lightbulb", "Compass", "Anchor", "Briefcase", "GraduationCap", "Gavel", "Stethoscope", "Sparkles"
    ];

    const prompt = `Create a DEEP, PROFOUND system instruction prompt AND a short description for an AI coach named "${name}".
    User provided context (optional): "${description}".
    
    IMPORTANT: Adapt the 'Persona Type' to the subject matter.
    
    ALSO: Choose the most relevant icon name from this list: ${possibleIcons.join(', ')}.

    Return a JSON object with:
    1. "prompt": The system instruction (at least 3 sentences).
    2. "description": A short tagline.
    3. "icon": The chosen icon name from the list.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert prompt engineer. You respond ONLY in valid JSON." },
                { role: "user", content: prompt }
            ],
            max_tokens: 350,
            temperature: 0.7,
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("❌ OpenAI API Fail:", response.status, errText);
        return {
            prompt: `You are a specialized AI coach acting as: ${name}. ${description}`,
            description: description || `AI coach for ${name}`,
            icon: 'Sparkles'
        };
    }

    const data = await response.json();
    try {
        const content = data.choices[0].message.content.trim();
        const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        console.log("🛠️ AI Parsed JSON:", parsed);

        let finalPrompt = parsed.prompt;
        const persona = parsed.Persona || parsed.persona;
        const tone = parsed.Tone || parsed.tone;
        const methodology = parsed.Methodology || parsed.methodology;
        const desc = parsed.description || parsed.Description;
        const icon = parsed.icon || parsed.Icon || 'Sparkles';

        // Handle case where AI returned structured object (Persona/Tone/Methodology) at root level
        if (persona && tone && methodology) {
            finalPrompt = `You are an expert ${name} coach acting as ${persona}. Your tone is ${tone}. ${methodology}`;
        }
        // Handle case where AI returned prompt as object
        else if (finalPrompt && typeof finalPrompt === 'object') {
            // If prompt object has structured fields, use them
            if (finalPrompt.Persona || finalPrompt.persona) {
                const p = finalPrompt.Persona || finalPrompt.persona;
                const t = finalPrompt.Tone || finalPrompt.tone;
                const m = finalPrompt.Methodology || finalPrompt.methodology;
                finalPrompt = `You are an expert ${name} coach acting as ${p}. Your tone is ${t}. ${m}`;
            } else {
                finalPrompt = JSON.stringify(finalPrompt);
            }
        }
        else if (!finalPrompt) {
            finalPrompt = `You are a specialized AI coach acting as: ${name}.`;
        }

        return {
            prompt: finalPrompt,
            description: desc || `Expert on ${name}`,
            icon: icon
        };

    } catch (e) {
        console.error("Failed to parse AI response", e);
        return {
            prompt: `You are a specialized AI coach acting as: ${name}.`,
            description: description || `Expert on ${name}`,
            icon: 'Sparkles'
        };
    }
};
