import fetch from 'node-fetch'; // Make sure you're using an environment that supports ES Modules

const commands = ['!zugdauerundrichtung', '!zugzeit', '!zugzeit2', '!zugzeit3', '!zugzeit4', '!zugzeitherzlichwillkomen'];
const links = [
    'https://cdn.discordapp.com/attachments/556278872530878494/1208869983782703144/image.png',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870045258620948/image.png',
    // Add the rest of your links here...
];

const randomCommand = commands[Math.floor(Math.random() * commands.length)];
const randomLink = links[Math.floor(Math.random() * links.length)];

const message = `${randomCommand}\n${randomLink}`;
const webhookURL = process.env.WEBHOOK_URL; // Make sure this environment variable is set

// Send the message to the Discord webhook
fetch(webhookURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: message }),
})
.then(response => {
    if (!response.ok) {
        // If the server responded with a non-OK HTTP status, throw an error to be caught below
        throw new Error('Failed to send message to Discord webhook');
    }
    // Optionally log a success message, no need to parse response as JSON
    console.log('Message sent successfully to Discord webhook');
})
.catch((error) => console.log('Error sending message to Discord webhook:', error));
