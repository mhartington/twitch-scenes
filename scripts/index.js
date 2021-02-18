const writeFile = require('fs').writeFileSync;

require('dotenv').config();

const channel = process.env.CHANNEL;
const username = process.env.USERNAME;
const token = process.env.TOKEN;
const isProd = process.env.ENVIRONMENT === 'production' ? true : false;

const envConfigFile = `
export const environment = {
  production: ${isProd},
  username:   '${username}',
  channel:    '${channel}',
  token:      '${token}',
}
`;
writeFile('src/environments/environment.ts', envConfigFile);
