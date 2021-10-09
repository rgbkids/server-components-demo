//@ts-check

export const t = (id, lang) => {
    const language_resources = require(__dirname + '/../settings');
    const resources = language_resources["language_resources"];

    let result = "";

    try {
        result = resources[lang]["translation"][id];
    } catch (e) {
        result = resources["ja"]["translation"][id];
    }

    return result;
};
