const fetch = require('node-fetch');

// Define your commands and links
const commands = ['!zugdauerundrichtung', '!zugzeit', '!zugzeit2', '!zugzeit3', '!zugzeit4', '!zugzeitherzlichwillkomen'];
const links = [
    'https://cdn.discordapp.com/attachments/556278872530878494/1208869983782703144/image.png?ex=65f74fe7&is=65e4dae7&hm=9b91b5880792f723657e86f716c72ab2e064be74d3f8b4333abb27005df67e41&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870045258620948/image.png?ex=65f74ff6&is=65e4daf6&hm=477211c961bbcc7ac433d717f0e5929ee8f1389b10b63fa5299a9c3a9edec84e&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208869929462403182/image.png?ex=65f74fda&is=65e4dada&hm=1c6b5922d7ad8a51f6d7546fa8a8fa6c98db59e2980d7ba78a64a788445e7bd2&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870076678283335/image.png?ex=65f74ffe&is=65e4dafe&hm=5b053e0cd64c4f3730826fd9bb1ea5a29996cf5880624bf9294a4847cdb3c5de&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870127135752242/image.png?ex=65f7500a&is=65e4db0a&hm=9b97130f096f5ca2df49e97a3a724c107cbfc81fd4b1b28bd91a0c7f3d43d8f0&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870172258074644/image.png?ex=65f75014&is=65e4db14&hm=9ca1e7ccc662ec6f7aa60b5de12047e122ff886ddf64334344d7e28302038781&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870220861804617/image.png?ex=65f75020&is=65e4db20&hm=d9490835d39df3041998e9047d8865344e682c6243bf20256fcf9c112dc60ca8&',
    'https://cdn.discordapp.com/attachments/556278872530878494/1208870263127547924/image.png?ex=65f7502a&is=65e4db2a&hm=566eaf93a630a049bbd4822185136aed63b4507da147f1f93b5a9c223d4b78fd&'
];

// Choose a random command and link
const randomCommand = commands[Math.floor(Math.random() * commands.length)];
const randomLink = links[Math.floor(Math.random() * links.length)];

// Combine them into a single message
const message = `${randomCommand}\n${randomLink}`;

// Your webhook URL (store this as a secret and access it via process.env)
const webhookURL = process.env.WEBHOOK_URL;

// Send the message to the Discord webhook
fetch(webhookURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: message }),
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch((error) => console.log('Error:', error));