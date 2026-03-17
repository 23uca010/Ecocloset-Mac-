const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'hello.log');
fs.writeFileSync(logFile, `Hello from Node at ${new Date().toISOString()}\n`);
console.log('Hello from Node!');
