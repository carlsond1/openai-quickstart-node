import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { document, tone } = req.body;

  try {
    const toneDescriptions = {
      "business casual": "The tone is business casual, which means it is professional but relaxed, friendly, and approachable.",
      "business fun": "The tone is business fun, which suggests a playful, creative, and more engaging style.",
      "business formal": "The tone is business formal, indicating a highly professional, precise, and formal approach.",
    };

    const prompt = `
    Edgile is a company founded in 2001 with a mission to deliver strategic cybersecurity and risk management services to Fortune 500 companies...

    Edgile is known for its brand personality traits of expertise, trustworthiness, strategic vision, collaboration, and innovation. They communicate with a voice that is confident, engaging, respectful, and optimistic. Their writing style is professional, yet accessible, using a balanced mix of technical and everyday language, favoring active voice for clarity and conciseness.

    When communicating, they strive to showcase their authority in cybersecurity and risk management, while maintaining a tone that is confident and optimistic. They respect their audience's knowledge and challenges, and tailor their communication to suit C-suite executives and decision-makers at large organizations.

    However, they avoid overusing jargon without clear explanations, using humor that might trivialize the importance of cybersecurity, disregarding cultural considerations, and overcomplicating messages.

    The selected tone for this document is: ${toneDescriptions[tone]}

    Given this, please evaluate the following copy and suggest improvements to better align with Edgile's brand voice and tone: "${document}"
`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 1024,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
