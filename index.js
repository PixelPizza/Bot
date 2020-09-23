const {Client} = require('discord.js');
const client = new Client();
const {token} = require('./config.json');

client.login(token);