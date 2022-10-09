module.exports = {
  convertToSlug: (str) => str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-'),

  formatedLowerCase: (array) => array.map((category) => ({
    name: category.name.toString()
      .normalize()
      .toLowerCase()
      .trim()
      .replace(/\s\s+/g, ' '),
  })),
};
