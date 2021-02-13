'use strict';

const https = require('https');
const http = require('http');
const {URL} = require('url');

/**
 * Send a request to the specified url
 * @param {string} url The url to make a request to
 * @param {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method The method to use
 * @returns {Promise<http.IncomingMessage>} The data the request returns
 */
const request = (url, method = "GET") => new Promise((resolve, reject) => {
    if(!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) return;
    const newUrl = new URL(url);
    const protocol = newUrl.protocol === "https:" ? https : http;
    protocol.request({
        hostname: newUrl.hostname,
        path: newUrl.pathname,
        method: method
    }, resolve).on('error', reject).end();
});

module.exports = request;