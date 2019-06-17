module.exports = (text, padding) => {
  if (text.length === 32) return text
  if (text.length < 32) return text.padEnd(32, padding);
  if (text.length > 32) return text.slice(0, 32);
};
