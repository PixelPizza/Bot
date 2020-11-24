'use strict';

const editEmbed = (embedMsg, options = {
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
}) => {
    if (options.color) embedMsg.setColor(options.color);
    if (options.title) embedMsg.setTitle(options.title);
    if (options.url) embedMsg.setURL(options.url);
    if (options.author?.name) embedMsg.setAuthor(options.author.name, options.author.icon, options.author.url);
    if (options.description) embedMsg.setDescription(options.description);
    if (options.thumbnail) embedMsg.setThumbnail(options.thumbnail);
    for (let index in options.fields) {
        const field = options.fields[index];
        if (field.name && field.value) embedMsg.addField(field.name, field.value, field.inline);
    }
    if (options.image) embedMsg.setImage(options.image);
    if (options.timestamp) embedMsg.setTimestamp();
    if (options.footer?.text) embedMsg.setFooter(options.footer.text, options.footer.icon);
    return embedMsg;
};

module.exports = editEmbed;