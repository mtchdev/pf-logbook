/**
 * projectFLY Logbook Exporter
 * 
 * By: mtchdev
 * 
 * Export your entire projectFLY logbook into a JSON file.
 */

const axios = require('axios');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n\n--- projectFLY Logbook Exporter ---\n\nGet your authToken from Inspect Element (CTRL+SHIFT+I) on the pF app -> Application Tab -> Local Storage -> authToken\nYou will need to use this token to authenticate the request to get your logbook.\nDO NOT share it with anyone else.\nThe token resets every 10 minutes so be quick!\n\nThis exporter will create a .json file in the current directory with your entire logbook.\n\n\n');

rl.question('authToken (find this in Inspect Element -> Application -> Local Storage) [DO NOT SHARE THIS] right click if ctrl + v doesnt work: ', async (token) => {    
    try {
        let res = await axios.get('https://api.projectfly.co.uk/api/v3/bookings/logbook?page=0&filter=', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (res.data) {
            try {
                let fileId = Math.random().toString(36).substr(2, 5);
                await fs.writeFileSync(`logbook-${fileId}.json`, JSON.stringify(res.data.data), 'utf8');
                console.log(`Successfully created logbook-${fileId}.json!`);
            } catch (e) {
                throw new Error(e);
            }
        } else {
            throw new Error('fuck you');
        }
    } catch (e) {
        throw new Error(e);
    }

    rl.close();
});

