'use strict';

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
        "Do you want to teach others how to do it?"
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
        "Are you online much?"
    ])
};