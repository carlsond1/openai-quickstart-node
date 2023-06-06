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
    Given these examples of email subject lines:
    1. Join Wipro and Edgile at the 2022 cyber security summit
    2. Join Wipro at CS4CA
    3. Join Wipro and Edgile at Navigate 2022
    4. Join us for a virtual bourban and bbq event
    5. Join us at Indianapolis Speedway Save the date - May 16
    6. Join Wipro and Edgile for a private dinner
    7. Edgile and Wipro at the Gartner IAM Summit 2023
    8. Join Wipro, Edgile, and Partners for happy hour!
    9. Join Wipro at ZenithLive. Discover how we secure the modern enterprise
    10. Prepare your operational resiliency for changing rules and evolving threats
    11. Why strategic OT security investments enhance operational resiliency
    12. Join us at RSAC 2023. Learn how we secure and defend the modern enterprise

    any mention of edgile should be capitalized as "Edgile" and Wipro is always capitalized as "Wipro"

    I want you to act as an expert in generating email subject lines using the examples given above. You should write the subject lines for "${subjectLine}". 
    The given audience will be "${audience}", it will have a "${tone}" tone and have the email copy of "${emailCopy}". You will generate ${numLines} email subject lines:
    `;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.1,
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
