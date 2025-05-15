// document.getElementById('form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const userInput = document.getElementById('user-input');
//   const chatbotConversation = document.getElementById('chatbot-conversation-container');
//   const question = userInput.value.trim();

//   if (!question) return;

//   userInput.value = '';

//   const newHumanSpeech = document.createElement('div');
//   newHumanSpeech.classList.add('speech', 'speech-human');
//   newHumanSpeech.textContent = question;
//   chatbotConversation.appendChild(newHumanSpeech);
//   chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

//   try {
//     const res = await fetch('/ask', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ question })
//     });

//     const data = await res.json();

//     const newAiSpeech = document.createElement('div');
//     newAiSpeech.classList.add('speech', 'speech-ai');
//     newAiSpeech.textContent = data.answer;
//     chatbotConversation.appendChild(newAiSpeech);
//     chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
//   } catch (err) {
//     console.error(err);
//   }
// });


const form = document.getElementById('form');
const userInput = document.getElementById('user-input');
const conversationContainer = document.getElementById('chatbot-conversation-container');

let conversationHistory = []; // <--- NEW

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  // Reset input
  userInput.value = '';

  // Display user message
  const userBubble = document.createElement('div');
  userBubble.classList.add('speech', 'speech-human');
  userBubble.textContent = question;
  conversationContainer.appendChild(userBubble);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;

  // Add user question to history
  conversationHistory.push({ role: "user", content: question });

  try {
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question,
        history: conversationHistory, // <--- SEND HISTORY
      }),
    });

    const data = await res.json();

    // Display bot response
    const botBubble = document.createElement('div');
    botBubble.classList.add('speech', 'speech-ai');
    botBubble.textContent = data.answer;
    conversationContainer.appendChild(botBubble);
    conversationContainer.scrollTop = conversationContainer.scrollHeight;

    // Add bot response to history
    conversationHistory.push({ role: "ai", content: data.answer });

  } catch (err) {
    console.error('Error:', err);
  }
});
