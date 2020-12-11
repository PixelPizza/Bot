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
    "No pizzas that are offensive or are related/imply any form of discrimination",
    "No pizzas related to child exploitation (this includes Pedophilia, Child abuse, or any other form of exploitation to minors)",
    "No controversial or political themed pizzas (however pizzas with a politician's face on them are allowed)",
    "No pizzas which relate to extreme ideologies or violent groups such as Hitler/Nazis and communism",
    "No illegal drugs (excluding weed)",
    "No pizzas that are related to death, depression, disorders, or mortal illnesses",
    "No pizzas which include gore/blood",
    "No poisons or other kinds of lethal substances (excluding bleach)",
    "No human flesh or human/animal body parts (however pictures of whole humans and animals are allowed)",
    "No spoiler pizzas",
    "No orders that contain more than 5 items/requests (Base pizza counts as an item)",
    "Must include a pizza (transparent & invisible pizzas are not allowed either)",
    "Do not attempt to bypass the word blacklist",
    "Use COMMON SENSE",
    "Don't ping temmie or any role that temmie has, you will get warned by him, watch out",
    "Ping <@779726306655862814>(@ping if Pizza takes too long to cook) if your pizza takes too long to cook",
    "We are Pixel Pizza, We do not serve any other foods than Pizza. (except on anarchy day)",
    "Give workers time to cook and deliver orders. They also do things besides cooking and delivering",
    "Do not complains about the order IDs or youll get a scp after you send by <@511209271678074891>", 
    "pixel Pizza must be in the guild in order to order a pizza"
];

/**
 * The anarchy rules of the bot
 */
let anarchyRules = [
    "No pizzas related to child exploitation (this includes Pedophilia, Child abuse, or any other form of exploitation to minors)",
    "No pizzas that are related to death, depression, disorders, or mortal illnesses",
    "No pizzas which includes gore",
    "Don't ping temmie or any role that temmie has, you will get warned by him, watch out",
    "Ping <@472312270047674378>(@ping if Pizza takes too long to cook) if your pizza takes too long to cook",
    "Give workers time to cook and deliver orders. They also do things besides cooking and delivering"
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
