'use strict';

const discord = require('discord.js');
const editEmbed = require("./editEmbed");

/**
 * Create a new embed with options
 * @param {{
 *  color:string,
 *  title:string,
 *  url:string,
 *  author:{
 *      name:string,
 *      icon:string,
 *      url:string
 *  },
 *  description:string,
 *  thumbnail:string,
 *  fields:{
 *      name:string,
 *      value:string,
 *      inline:boolean
 *  }[],
 *  image:string,
 *  timestamp:boolean,
 *  footer:{
 *      text:string,
 *      icon:string
 *  }
 * }} options The options for the embed message
 * @returns {discord.MessageEmbed} The made embed message
 */
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
}) => editEmbed(new discord.MessageEmbed(), options);

module.exports = createEmbed;