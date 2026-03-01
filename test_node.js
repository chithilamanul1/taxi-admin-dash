const path = require('path');
console.log('Path module loaded successfully');
console.log('__dirname:', __dirname);
console.log('Resolved path:', path.join(__dirname, '.env'));
process.exit(0);
