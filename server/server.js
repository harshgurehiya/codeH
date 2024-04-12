import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
//import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai";

dotenv.config(); //To use dotenv variable

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration); //Creating instance of openai

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

//Setting middlewares
app.use(cors()); //allow our servers to called from frontend
app.use(express.json()); //allow us to pass json from frontend to backend

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeH",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.completions.create({
      model: "davinci-002",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log("Server is running..."));
