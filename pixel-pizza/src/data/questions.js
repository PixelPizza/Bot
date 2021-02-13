'use strict';

/**
 * Makes a new application type
 * @param {string} name The name of the application
 * @param {string[]} questions The questions of the application
 * @param {string[]} aliases The aliases of the application
 */
const makeType = (name, questions, aliases = []) => {
    if(typeof name == "string" && Array.isArray(questions) && Array.isArray(aliases)){
        return {
            name: name,
            aliases: aliases,
            questions: questions
        }
    }
    throw new Error("Invalid question type format");
}

/**
 * A dictionary with application types
 */
module.exports = {
    worker: makeType("worker", [
        "Do you know the rules?",
        "Have you been a worker before (if so when)?",
        "Is there anything else you wish to add? (If you are a previous worker and are interested in a rehire, state it here.)",
        "Why do you want to become a worker?",
        "Do you have a photo-edit program?"
    ], [
        "cook",
        "chef",
        "deliver",
        "deliverer"
    ]),
    teacher: makeType("teacher", [
        "are you online a lot?",
        "what makes you a good teacher?",
        "do you want to teach others how to work at Pixel Pizza?",
        "why should we chose you over other applicants?"
    ], [
        "teach"
    ]),
    developer: makeType("developer", [
        "What programming languages do you use?",
        "How much experience do you have with programming?",
        "why do you want to become a Pixel Pizza developer?",
        "Do you have github? (if so what is you github username)"
    ], [
        "dev"
    ]),
    staff: makeType("staff", [
        "Are you online much?",
        "Are you staff in another server?",
        "How many hours can you be online?",
        "Why should we hire you and not someone else?",
        "Do you have experience?"
    ])
};