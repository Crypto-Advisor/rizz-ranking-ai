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
      }
    });
    return;
  }

  const pickup_line = req.body.pickup_line || '';
  if (pickup_line.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid pickup line",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-curie-001",
      prompt: generatePrompt(pickup_line),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(pickup_line) {
  return `
  Decide whether this is a good pickup line on a scale from 1-1000. (1 being the worst, 1000 being the best):
   Lets fuck tomorrow.
    Score:10
  Decide whether this is a good pickup line on a scale from 1-1000. (1 being the worst, 1000 being the best):
   I know we don't know each other very well, but I think it would be fun to grab coffee this weekend if your free.
    Score:730
  Decide whether this is a good pickup line on a scale from 1-1000. (1 being the worst, 1000 being the best):
   Im really horny lets fuck tomorrow if your free.
    Score:200
  Decide whether this is a good pickup line on a scale from 1-1000. (1 being the worst, 1000 being the best):
   We've been friends for awhile but I've been thinking about it and I would like to take you to dinner on Thursday if your free.
    Score:510
  Decide whether this is a good pickup line on a scale from 1-1000. (1 being the worst, 1000 being the best):
   ${pickup_line}
    Score:`;
}
