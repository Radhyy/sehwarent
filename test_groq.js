require('dotenv').config({path: '.env.local'});
const Groq = require('groq-sdk');

const keys = process.env.GROQ_API_KEYS.split(',');
const groq = new Groq({ apiKey: keys[0] });

async function testGroq() {
  const modelsToTest = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'allam-2-7b'];
  for (const model of modelsToTest) {
    try {
      console.log("Testing model:", model);
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Say hello in JSON format: {"hello": "world"}' }],
        model: model,
        temperature: 0,
        response_format: { type: 'json_object' }
      });
      console.log(`✅ Model ${model} is working! Response:`, completion.choices[0].message.content);
      break;
    } catch (e) {
      console.error(`❌ Error with ${model}:`, e.message);
    }
  }
}

testGroq();
