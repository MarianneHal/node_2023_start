const fs = require('fs/promises');
const path = require('node:path');

const pathTo = path.join(process.cwd(),'users', 'users.json');
module.exports = {
    writer: async(users) => {
        await fs.writeFile( pathTo, JSON.stringify(users));
    },

    reader: async () => {
        const buffer =  await fs.readFile(pathTo);
        return JSON.parse(buffer.toString());
    }
}