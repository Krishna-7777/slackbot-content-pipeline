function cleanKeywords(keywords) {
  const stopWords = ["the", "is", "in", "a", "of", "to", "and", "on", "for"];

  const normalized = keywords
    .map(k => k
      .toLowerCase()
      .trim()
      // replace punctuation and symbols with spaces
      .replace(/[-_/\\|]+/g, " ")
      // remove multiple spaces
      .replace(/\s+/g, " ")
      // remove non-alphanumeric except spaces
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
    )
    .filter(k => k.length > 1 && !stopWords.includes(k));

  // remove duplicates
  const unique = Array.from(new Set(normalized));

  return unique;
}

module.exports = {cleanKeywords};
