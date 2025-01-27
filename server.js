import express from 'express';
import path from 'path';
const app = express();
const port = 3030;
import fs from 'fs';
import axios from 'axios';
import OpenAI from 'openai' ;
import bodyParser from 'body-parser'   // really important otherwise the body of the request is empty
app.use(bodyParser.urlencoded({ extended: false }));

// get OPENAI_API_KEY from GitHub secrets
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai = new OpenAI({apiKey: OPENAI_API_KEY});

// Middleware to parse JSON payloads in POST requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('./'));

// Serve index.html at the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// GET route
app.post('/test-prompt', async(req, res) => {
    const topic = req.body.topic;
    const style = req.body.style;
    const tone = req.body.tone;
    const language = req.body.language;
    res.json({  message: "Write a two paragraph article on this topic: " + topic + "using this tone: " + tone + " in this style: " + style + " in this language: " + language });
});
// Existing imports and setup here...

// New /prompt POST route


app.post('/prompt', async(req, res) => {
  // get the values from the request 
  console.log(JSON.stringify(req.body));
  const topic = req.body.topic;
  const style = req.body.style;
  const tone = req.body.tone;
  const language = req.body.language;
  console.log("topic: " + topic)

  try {
      let prompt = "Write aproximately two paragraph article on this topic: " + topic + " using this tone: " + tone + " in this style: " + style + " in this language: " + language;
      console.log("prompt: " + prompt)
      await openai.completions.create({
            model: "text-davinci-003",
                      prompt: prompt,
                      max_tokens: 32,
                      temperature: 0.5,
                    }).then((response) => {
                        let chatResponse = response.choices[0].text;
                        console.log("chatResponse: " + chatResponse);
                        // send response text back to client
                    res.send(chatResponse);
      });
  } catch (error) {
        console.error('Error:', error);
  }
});
    
    
// Test API key
app.get('/test-key', async (req, res) => {
  console.log("test-key")
  try {
    console.log("in test-key:" + openai.apiKey)
    let prompt = "Say hello world in French";
    await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.5,
    }).then((response) => {
        console.log(response.choices[0].text);
        console.log("test-key response sent")
        res.send(response.choices[0].text);
    });
  } catch (error) {
      return console.error('Error:', error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
