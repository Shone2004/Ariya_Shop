const getRandomRating = () => {
  // Random rating between 4.2 and 5.0, rounded to 1 decimal place
  const rating = Math.random() * (5.0 - 4.2) + 4.2;
  return Math.round(rating * 10) / 10;
};

const getRandomReviewCount = () => {
  // Random review count between 50 and 250
  return Math.floor(Math.random() * (250 - 50 + 1)) + 50;
};

module.exports = {
  getRandomRating,
  getRandomReviewCount
};
