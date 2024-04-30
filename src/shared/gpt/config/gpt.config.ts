import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const config: OpenAI.Chat.ChatCompletionCreateParams = {
  messages: [],
  model: 'gpt-4',
  max_tokens: 1000,
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export { client, config };
