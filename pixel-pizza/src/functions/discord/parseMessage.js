'use strict';

const {randomInt} = require('crypto');
const { User, Guild, TextChannel, Invite } = require('discord.js');
const PPClient = require('../../classes/PPClient');
const {currency, minPrice, maxPrice} = require('../../data/config');
const timestampToDate = require('../datetime/timestampToDate');
const timestampToTime = require('../datetime/timestampToTime');
const timestampToDatetime = require('../datetime/timestampToDatetime');
const makeUserRegex = require('../regex/makeUserRegex');
const getEmoji = require('./getEmoji');
const {text} = require('../../data/channels');

/**
 * Make a new regex for dates
 * @param {string} name The name of the placeholder
 * @returns {RegExp} A regex for dates
 */
const makeDateRegex = (name) => RegExp(`{${name}date(?:: *(date|time|datetime))?}`, "g");

/**
 * Parses a user to an attribute of the user
 * @param {"tag" | "id" | "name" | "username" | "ping" | "mention"} [type] The type it should be parsed to (ping if no value) 
 * @param {User | string} user The user to use for parsing 
 */
const parseUser = (type, user) => {
    if(!user) return "Unknown user";
    if(typeof(user) == "string") return user;
    switch(type){
        default:
        case "tag":
            return user.tag;
        case "id":
            return user.id;
        case "name":
        case "username":
            return user.username;
        case "ping":
        case "mention":
            return `<@${user.id}>`;
    }
}

const parseCustomer = (type, user) => {
    type = !type ? "ping" : type;
    return parseUser(type, user);
}

/**
 * Parses a timestamp to date, time or datetime
 * @param {"date" | "time" | "datetime"} [type] The type it should be parsed to (datetime if no value) 
 * @param {User | string} user The user to use for parsing 
 */
const parseTimestamp = (type, timestamp) => {
    switch(type){
        case "date":
            return timestampToDate(timestamp);
        case "time":
            return timestampToTime(timestamp);
        default:
        case "datetime":
            return timestampToDatetime(timestamp);
    }
}

/**
 * Parse a delivery message
 * @param {PPClient} client The client to get the guild from
 * @param {string} message The message to parse
 * @param {string | User} chef The user that cooked the order
 * @param {User} customer The user that ordered the order
 * @param {string} image The url of the image
 * @param {string} invite The invite code of the support server
 * @param {User} deliverer The user that delivered the order
 * @param {string} orderID The id of the order
 * @param {string} order The order
 * @param {number} orderDate The timestamp of the order date
 * @param {number} cookDate The timestamp of the cook date
 * @param {number} deliverDate The timestamp of the delivery date
 * @param {string | Guild} guild The guild to get the name from
 * @param {string | TextChannel} channel The channel to get the name from
 * @param {boolean} escaped Wether or not the message should have escaped users for letting it be copied
 * @returns {Promise<string>} The parsed message
 */
const parseMessage = async (client, message, chef, customer, image, deliverer, orderID, order, orderDate, cookDate, deliverDate, guild, channel, escaped = false) => {
    /** @type {Invite} */
    const invite = await client.guild.channels.cache.get(text.restaurant).createInvite({maxAge: 0, maxUses: 0, unique: false});
    const addition = escaped ? "`" : "";
    return message
    .replace(makeUserRegex("chef"), (r, type) => addition+parseUser(type, chef)+addition)
    .replace(makeUserRegex("customer"), (r, type) => addition+parseCustomer(type, customer)+addition)
    .replace(/{image}/g, image)
    .replace(/{invite}/g, invite.url.replace("https://", ""))
    .replace(makeUserRegex("deliverer"), (r, type) => addition+parseUser(type, deliverer)+addition)
    .replace(/{orderID}/g, orderID) 
    .replace(/{order}/g, order)
    .replace(/{price}/g, ` ${escaped ? `:${getEmoji(client.guild, currency).name}:` : getEmoji(client.guild, currency)} ${randomInt(minPrice, maxPrice)}`)
    .replace(makeDateRegex("order"), (r, type) => parseTimestamp(type, orderDate))
    .replace(makeDateRegex("cook"), (r, type) => parseTimestamp(type, cookDate))
    .replace(makeDateRegex("delivery"), (r, type) => parseTimestamp(type, deliverDate))
    .replace(/{guild}|{server}/g, typeof guild == "string" ? guild : guild.name)
    .replace(/{channel}/g, typeof channel == "string" ? channel : channel.name);
}

module.exports = parseMessage;
