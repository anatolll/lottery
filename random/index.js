const LocalRandomService = require('./LocalRandomService');
const RandomOrgService = require('./RandomOrgService');

const argv = require('minimist')(process.argv.slice(2));
if (typeof argv.apiKey !== 'string') {
  console.error('You need provide random.org api key in application parameters');
  console.error('Example: node bin/www --apiKey 550e8400-e29b-41d4-a716-446655440000');
  process.exit();
}

module.exports = new RandomOrgService(argv.apiKey);