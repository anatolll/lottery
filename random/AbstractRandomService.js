class AbstractRandomService {
  /**
   * Generate array of integers
   * @param count How many random integers you need
   * @param min The lower boundary for the range from which the random numbers will be picked, inclusive
   * @param max The upper boundary for the range from which the random numbers will be picked, inclusive
   * @returns {Promise<void>}
   */
  async generateSignedIntegers(count, min, max) {
    throw new Error('Not implemented');
  }
}

module.exports = AbstractRandomService;