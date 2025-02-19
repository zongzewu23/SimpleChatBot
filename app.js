require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { error } = require('console');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const modelName = "gemini-2.0-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: modelName,

});

const chatSession = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.7
  }
});

app.post('/chat', async (req, res) => {
  try {
    const {prompt} = req.body;
    if (!prompt) {
      return res.status(400).json({error:"Prompt is missing"});
    }

    const result = await chatSession.sendMessage(prompt);
    const textResponse = result.response.text();

    res.json({    
      response: textResponse,
      model: modelName
    });
  } catch (error) {
    console.error("Error calling Gemini API", error);
    res.status(500).json({error:"Failed to fetch response"});
  }
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status.json({
        error: "Prompt is missing"
      });
    }

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    res.json({
      response: textResponse,
      model: modelName
    });
  } catch (error) {
    console.error("Error calling Gemini API", error);
    res.status(500).json({
      error: "Failed to fetch response"
    });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));