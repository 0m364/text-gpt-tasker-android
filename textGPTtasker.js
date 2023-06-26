// Make sure to install the 'request-promise' and 'tasker-api' packages
const request = require('request-promise');
const Tasker = require('tasker-api');

// Tasker instance
const tasker = new Tasker();

// OpenAI API configuration
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = 'YOUR_OPENAI_API_KEY';
const model = 'gpt-3.5-turbo';

// Phone number to send replies to
const phoneNumber = 'RECIPIENT_PHONE_NUMBER';

// Tasker task to send SMS
const sendSmsTask = {
  action: 'android.intent.action.SENDTO',
  data: 'smsto:' + phoneNumber,
  extras: {
    'android.intent.extra.TEXT': '',
  },
};

// Triggered when a new SMS is received
tasker.on('sms', async (context) => {
  const receivedMessage = context.data.message;

  // Create the chat message object
  const chatMessage = [
    {
      role: 'name of choice',
      content: 'Your content here.',
    },
    {
      role: 'user',
      content: receivedMessage,
    },
  ];

  try {
    // Send the message to ChatGPT API
    const response = await request.post({
      uri: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: chatMessage,
      }),
    });

    // Parse the API response
    const responseData = JSON.parse(response);
    const replyMessage = responseData.choices[0].content.trim();

    // Update the SMS text with the generated reply
    sendSmsTask.extras['android.intent.extra.TEXT'] = replyMessage;

    // Trigger the Send SMS task
    tasker.trigger(sendSmsTask);
  } catch (error) {
    console.error('Error:', error);
  }
});

// Start listening for SMS events
tasker.start();

// eyes 
