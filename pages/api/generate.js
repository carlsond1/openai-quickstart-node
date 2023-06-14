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

  const { audience, subjectLine, tone, emailCopy, numLines } = req.body;

  // Add any validation for inputs here...

  try {
    const prompt = `
      Edgile is a company founded in 2001 with a mission to deliver strategic cybersecurity and risk management services to Fortune 500 companies. They offer services such as consulting, managed services, and provision of harmonized regulatory content. They primarily serve large organizations in the healthcare, financial services, energy, and retail industries. 

      Edgile is known for its brand personality traits of expertise, trustworthiness, strategic vision, collaboration, and innovation. They communicate with a voice that is confident, engaging, respectful, and optimistic. Their writing style is professional, yet accessible, using a balanced mix of technical and everyday language, and favoring active voice for clarity and conciseness. 
      
      When communicating, they strive to showcase their authority in cybersecurity and risk management, while maintaining a tone that is confident and optimistic. They respect their audience's knowledge and challenges, and tailor their communication to suit C-suite executives and decision-makers at large organizations.
      
      However, they avoid overusing jargon without clear explanations, using humor that might trivialize the importance of cybersecurity, disregarding cultural considerations, and overcomplicating messages.
      
      Given this, please generate ${numLines} email subject lines for an ${audience} audience, with a ${tone} tone, about the topic of ${subjectLine}. The email copy is as follows: ${emailCopy}.
    `;
  
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 60 * numLines,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
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
