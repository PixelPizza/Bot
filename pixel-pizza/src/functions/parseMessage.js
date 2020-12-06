'use strict';

const {randomInt} = require('crypto');
const { User, Guild, TextChannel } = require('discord.js');
const {currency, minPrice, maxPrice} = require('../data/config');
const timestampToDate = require('./timestampToDate');

/**
 * Parse a delivery message
 * @param {string} message The message to parse
 * @param {string | User} chef The user that cooked the pizza
 * @param {User} customer The user that ordered the pizza
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
 * @returns {string} The parsed message
 */
const parseMessage = (message, chef, customer, image, invite, deliverer, orderID, order, orderDate, cookDate, deliverDate, guild, channel) => {
    return message
    .replace(/{chef}/g, typeof chef == "string" ? chef : `<@${chef.id}>`)
    .replace(/{customer}/g, `<@${customer.id}>`)
    .replace(/{image}/g, image)
    .replace(/{invite}/g, invite)
    .replace(/{deliverer}/g, `<@${deliverer.id}>`)
    .replace(/{orderID}/g, orderID) 
    .replace(/{order}/g, order)
    .replace(/{price}/g, `${currency}${randomInt(minPrice, maxPrice)}`)
    .replace(/{orderdate}/g, timestampToDate(orderDate))
    .replace(/{cookdate}/g, timestampToDate(cookDate))
    .replace(/{deliverydate}/g, timestampToDate(deliverDate))
    .replace(/{guild}|{server}/g, typeof guild == "string" ? guild : guild.name)
    .replace(/{channel}/g, typeof channel == "string" ? channel : channel.name);
}

module.exports = parseMessage;