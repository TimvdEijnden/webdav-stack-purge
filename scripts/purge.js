// Validate arguments
if(process.argv.length < 4) {
    console.error('missing 3 arguments: username password folder')
    process.exit(1);
}

// Configuration
const PASSWORD = process.argv[3];
const USERNAME = process.argv[2];
const FOLDER = process.argv[4];
const DAYS_LIMIT = process.argv[5] || 60;

const { createClient } = require("webdav");

const limitDate = new Date();
limitDate.setDate(limitDate.getDate() - DAYS_LIMIT);
limitDate.setHours(0,0,0,0);

// Setup WebDav
const client = createClient(
    `https://${USERNAME}.stackstorage.com/remote.php/webdav/`,
    {
        username: USERNAME,
        password: PASSWORD
    }
);

// Remove folders which are older than the specified limit
async function purge() {
    const removed = []
    const directories = await client.getDirectoryContents(FOLDER);
    console.log(`The ${FOLDER} directory contains ${directories.length} directories.`);
    directories.forEach(async folder => {
        const name = folder.basename;
        const folderDate = new Date(parseInt(name.substr(0,4)), parseInt(name.substr(4,2)-1), parseInt(name.substr(6,2))+1);
        if (!isNaN(folderDate.getTime()) && folderDate <= limitDate) {
            removed.push(folder.filename)
            await client.deleteFile(folder.filename);
        }
    });
    if  (removed.length) {
        console.log(`Removed: ${removed.join(', ')}.`);
    } else{
        console.log('Nothing to remove');
    }
}

purge();