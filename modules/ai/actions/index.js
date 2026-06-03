"use server";

/**
 * Action: getAiHint
 * Provides a subtle, tutoring-oriented hint to the user based on their current code and problem description.
 */
export async function getAiHint({ problemTitle, problemDescription, code, language }) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return {
        success: false,
        error: "GROQ_API_KEY is not configured in environment variables. Please add it to your .env file.",
      };
    }

    const systemInstruction = `You are an expert programming tutor on a competitive coding platform. Your goal is to guide the student to solve the problem themselves. Analyze their code and the problem. Give them a subtle, helpful hint, explain the logical error, or point out edge cases they might have missed, but DO NOT provide the final code solution under any circumstances. Keep the response concise, encouraging, and formatted in clean markdown.`;

    const prompt = `Problem Title: ${problemTitle}
Problem Description: ${problemDescription}
User's Current Code (${language}):
\`\`\`${language.toLowerCase()}
${code}
\`\`\`
Please review my code and give me a hint on how to proceed or what I am doing wrong.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const hint = data.choices?.[0]?.message?.content || "";

    return {
      success: true,
      hint: hint,
    };
  } catch (error) {
    console.error("Error generating AI hint:", error);
    return {
      success: false,
      error: error.message || "Failed to generate hint. Please try again.",
    };
  }
}

/**
 * Action: reviewCode
 * Analyzes the user's code for time/space complexity and suggestions, returning structured JSON content.
 */
export async function reviewCode({ problemTitle, problemDescription, code, language }) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return {
        success: false,
        error: "GROQ_API_KEY is not configured in environment variables. Please add it to your .env file.",
      };
    }

    const systemInstruction = `You are an elite software architect and algorithm reviewer. Analyze the provided programming solution. Respond strictly with a JSON object matching this schema:
{
  "timeComplexity": "e.g. O(N log N)",
  "spaceComplexity": "e.g. O(N)",
  "reviewSummary": "A concise summary of the code quality, readability, and overall correctness.",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],
  "refactoredCode": "An optimized and clean version of the code, properly indented and using best practices."
}
Do not output any markdown code blocks or conversational text around the JSON. Return only the JSON string.`;

    const prompt = `Problem Title: ${problemTitle}
Problem Description: ${problemDescription}
User's Code (${language}):
\`\`\`${language.toLowerCase()}
${code}
\`\`\`
Please analyze my code and provide the review JSON.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsedData = JSON.parse(content);

    return {
      success: true,
      review: parsedData,
    };
  } catch (error) {
    console.error("Error performing AI code review:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze code. Please try again.",
    };
  }
}
