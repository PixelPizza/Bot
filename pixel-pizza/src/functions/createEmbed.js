'use strict';

const editEmbed = require("./editEmbed");
const { MessageEmbed } = require("discord.js");

const createEmbed = (options = {
    color: "",
    title: "",
    url: "",
    author: {
        name: "",
        icon: "",
        url: ""
    },
    description: "",
    thumbnail: "",
    fields: [
        {
            name: "",
            value: "",
            inline: false
        }
    ],
    image: "",
    timestamp: false,
    footer: {
        text: "",
        icon: ""
    }
}) => editEmbed(new MessageEmbed(), options);

module.exports = createEmbed;