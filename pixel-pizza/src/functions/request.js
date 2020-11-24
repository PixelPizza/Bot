'use strict';

const https = require('https');
const http = require('http');
const {URL} = require('url');

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