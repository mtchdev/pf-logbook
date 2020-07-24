/**
 * projectFLY Logbook Exporter
 * 
 * By: mtchdev & AndrewTech
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

const logs = {}

console.log('\n\n--- projectFLY Logbook Exporter ---\n\nGet your authToken from Inspect Element (CTRL+SHIFT+I) on the pF app -> Application Tab -> Local Storage -> authToken\nYou will need to use this token to authenticate the request to get your logbook.\nDO NOT share it with anyone else.\nThe token resets every 10 minutes so be quick!\n\nThis exporter will create a .json file in the current directory with your entire logbook.\n\n\n');

rl.question('authToken (find this in Inspect Element -> Application -> Local Storage) [DO NOT SHARE THIS] right click if ctrl + v doesnt work: ', async (token) => {    
    try {
        let res = await makeRequest('https://api.projectfly.co.uk/api/v3/bookings/logbook?page=0&filter=', token);
        if (res.data) {
            try {
                let Objects = Object.values(res.data.data);
                console.log('Working...');
                for (let i = 0; i < Objects.length; i++) {
                    let data = Objects[i];
                    try {
                        let res = await makeRequest(`https://api.projectfly.co.uk/api/v3/bookings/${data.id}/details`, token);
                        let log = res.data.data;
                        let flight_number = log.flight_number.split('\/');
                        logs[data.id] = {
                            "Booking": {
                                "Departure_Icao": log.departure.icao,
                                "Arrival_Icao":  log.arrival.icao,
                                "Status": log.status_code,
                                "Callsign": flight_number[0], 
                                "Flight_Number": flight_number[1],
                                "User_Aircraft": 0 // We are unable to get the User_aircraft id
                            },
                            "Flight": {
                                "Time_Started": log.flight.time_started, 
                                "Time_Ended": log.flight.time_ended,
                                "Landing_Fpm": log.flight.landing_fpm, 
                                "Status": 2
                            }
                          }
                    } catch (e) {
                        console.log('Something wen\'t wrong (likely auth token refresh). We\'ve made the file for you anyway.');
                        makeFile();
                        return;
                    }

                    console.log(`Finished ${i + 1} of ${Objects.length}`);

                    if (i === Objects.length - 1) {
                        makeFile();
                    }
                };
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


async function makeRequest(url, token) {
    let request = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    return request
}

async function makeFile() {
    let fileId = Math.random().toString(36).substr(2, 5);
    await fs.writeFileSync(`Bookings_${fileId}.json`, JSON.stringify(logs), 'utf8');
    console.log(`Successfully created Bookings-${fileId}.json!`);
}
