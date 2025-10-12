const { parse } = require('csv-parse/sync');

function parseCSV(text) {
    try {
        const records = parse(text, {
            columns: false,
            skip_empty_lines: true,
            trim: true
        });
        rawKeywords = records.flat();

        return rawKeywords
    } catch (error) {
        console.error(error)
        return []
    }
}

module.exports = { parseCSV }