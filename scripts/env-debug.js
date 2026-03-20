const fs = require('fs');
const path = require('path');

const report = {
    cwd: process.cwd(),
    dirname: __dirname,
    platform: process.platform,
    env_port: process.env.PORT,
    files_in_cwd: fs.readdirSync('.')
};

fs.writeFileSync('env_debug.json', JSON.stringify(report, null, 2));
console.log('Env debug report written to env_debug.json');
