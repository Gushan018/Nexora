const fs = require('fs');

const input = fs.readFileSync(0, 'utf8');
const cleaned = input.split('\n').filter(line => !/Co-Authored-By:\s*Claude/i.test(line)).join('\n');
process.stdout.write(cleaned);
