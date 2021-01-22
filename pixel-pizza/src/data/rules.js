'use strict';

/**
 * Makes an infinite number generator
 */
const infinite = function*(){
    let index = 1;
    while(true) yield index++;
}
const rulesGenerator = infinite();
const anarchyGenerator = infinite();

/**
 * The rules of the bot
 */
let rules = [
    "No NSFW",
    "No items that are offensive or are related/imply any form of discrimination",
    "No items related to child exploitation (this includes Pedophilia, Child abuse, or any other form of exploitation to minors)",
    "No controversial or political themed items (however orders with a politician's face on them are allowed)",
    "No items which relate to extreme ideologies or violent groups such as Hitler/Nazis and communism",
    "No illegal drugs (excluding weed)",
    "No items that are related to death, depression, disorders, or mortal illnesses",
    "No items which include gore/blood",
    "No poisons or other kinds of lethal substances (excluding bleach)",
    "No human flesh or human/animal body parts (however pictures of whole humans and animals are allowed)",
    "No spoiler items",
    "No orders that contain more than 5 items/requests (Base counts as an item)",
    "Must include a food item (transparent & invisible orders are not allowed either)",
    "Do not attempt to bypass the word blacklist",
    "Use COMMON SENSE",
    "pixel Pizza must be in the guild in order to order",
    "no asking for your pfp on an item"
];

/**
 * The anarchy rules of the bot
 */
let anarchyRules = [
    "No items related to child exploitation (this includes Pedophilia, Child abuse, or any other form of exploitation to minors)",
    "No items that are related to death, depression, disorders, or mortal illnesses",
    "No items which includes gore"
];

for(let index in rules){
    rules[index] = `[${rulesGenerator.next().value}] ${rules[index]}`;
}

for(let index in anarchyRules){
    anarchyRules[index] = `[${anarchyGenerator.next().value}] ${anarchyRules[index]}`;
}

/**
 * A dictionary of the rules and anarchy rules of the bot
 */
module.exports = {rules: rules, anarchyRules: anarchyRules};
