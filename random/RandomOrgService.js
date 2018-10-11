const axios                 = require('axios');
const uuid                  = require('uuid/v4');
const AbstractRandomService = require('./AbstractRandomService');
const ApiError              = require('./ApiError');

const BaseUrl    = 'https://api.random.org/json-rpc/1/invoke';
const ApiVerison = '2.0';

const ErrorMessages = {
  HttpStatus:       'Random.org returned wrong http status',
  EmptyData:        'Random.org returned empty response data',
  NotHaveSignature: 'Random.org not returned signature',
  ApiError:         'Random.org returned error',
  NotHaveNumbers:   'Random.org not returned numbers array',
  WrongId:          'Random.org returned wrong response id'
};

class RandomOrgService extends AbstractRandomService {
  /**
   * @param apiKey Random.org api key
   */
  constructor (apiKey) {
    super();
    this.apiKey = apiKey;
  }

  /**
   * Generate array of integers
   * @param count {number} How many random integers you need
   * @param min {number} The lower boundary for the range from which the random numbers will be picked, inclusive
   * @param max {number} The upper boundary for the range from which the random numbers will be picked, inclusive
   * @returns {Promise<{numbers: number[], signature: string, json: string}>}
   */
  async generateSignedIntegers (count, min, max) {
    let response;

    //try get random numbers from api
    response = await this._sendRequest('generateSignedIntegers', {
      n:           count,
      min:         min,
      max:         max,
      replacement: false
    });

    //validate response
    if (typeof response.data.result.signature !== 'string') {
      throw new ApiError(ErrorMessages.NotHaveSignature, response.status);
    }
    if (!response.data.result.random || !Array.isArray(response.data.result.random.data)) {
      throw new ApiError(ErrorMessages.NotHaveNumbers, response.status);
    }

    return Promise.resolve({
      numbers:   response.data.result.random.data,
      signature: response.data.result.signature,
      json:      JSON.stringify(response.data)
    });
  }

  /**
   * Send request to random.org api
   * @param {string} method Api method
   * @param {object} params Request params
   * @param {string} id Request id
   * @returns {Promise<object>}
   * @private
   */
  async _sendRequest (method, params, id = uuid()) {
    const data = {
      id,
      method,
      jsonrpc: ApiVerison,
      params:  {
        ...params,
        apiKey: this.apiKey
      }
    };

    const response = await axios({
      method:  'post',
      url:     BaseUrl,
      headers: {'Content-type': 'application/json-rpc'},
      data
    });

    if (!response) {
      throw new ApiError(ErrorMessages.HttpStatus);
    }
    if (response.status !== 200) {
      throw new ApiError(ErrorMessages.HttpStatus, response.status);
    }
    if (!response.data) {
      throw new ApiError(ErrorMessages.EmptyData, response.status);
    }
    if (response.data.error || !response.data.result) {
      throw new ApiError(ErrorMessages.ApiError, response.status, response.data.error);
    }
    if (!response.data.id || response.data.id !== id) {
      throw new ApiError(ErrorMessages.WrongId, response.status, response.data.id);
    }

    return response;
  }
}

module.exports = RandomOrgService;