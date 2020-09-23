const {Client} = require('discord.js');
const client = new Client();
const {token} = require('./config.json');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on('error', error => {
    console.error('The websocket connection encountered an error:', error);
});

client.login(token);