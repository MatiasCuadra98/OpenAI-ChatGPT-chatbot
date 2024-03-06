import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
  console.log(colors.bold.green('Hi! I am a chatGPT ChatBot!'));
  console.log(colors.bold.green('You can start asking anything you want!'));

  const chatHistory = []; // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: 'user', content: userInput });

      // **Include Authorization Header with API key**
      const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      };

      // Call the API with user input & history, passing headers
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        // Spread the `headers` object directly into the function call
        ...headers,
      });
      

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();
