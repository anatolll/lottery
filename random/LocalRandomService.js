const AbstractRandomService = require('./AbstractRandomService');

class LocalRandomService extends AbstractRandomService {
  /**
   * Generate array of integers
   * @param count How many random integers you need
   * @param min The lower boundary for the range from which the random numbers will be picked, inclusive
   * @param max The upper boundary for the range from which the random numbers will be picked, inclusive
   * @returns {Promise<{numbers: array[integer], signature: string, json: string}>}
   */
  async generateSignedIntegers (count, min, max) {
    const result = [];
    for (let i = 0; i < count; i++) {
      let randomNumber = null;
      do {
        randomNumber = Math.floor(Math.random() * (1 + max - min) + min);
      } while (result.indexOf(randomNumber) !== -1);

      result.push(randomNumber);
    }
    return Promise.resolve({
      numbers:   result,
      signature: '',
      json:      ''
    });
  }
}

module.exports = LocalRandomService;