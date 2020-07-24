import React from 'react';
import * as axios from 'axios';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            data: {},
            totalLength: 0,
            currentLength: 0,
            done: false,
            running: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
        this.finish = this.finish.bind(this);
        
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input value={this.state.token} onChange={this.handleChange} placeholder="Auth Token"></input>
                    <button className="submit" disabled={this.state.running}>Get Logbook</button>
                    <a href="https://github.com/mtchdev/pf-logbook/blob/master/auth_token.md" target="_BLANK">Learn how to get your auth token</a>
                </form>
                <div className="logs">
                    <code>Finished { Object.keys(this.state.data).length } of { this.state.totalLength } flights</code>
                    {
                        this.done ? <code>Finished! Your download will start shortly.</code> : ''
                    }
                </div>
            </div>
        )
    }

    handleChange(e) {
        this.setState({
            token: e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.state.running) return;
        
        try {
            let res = await this.makeRequest('https://api.projectfly.co.uk/api/v3/bookings/logbook?page=0&filter=');
            if (res.data) {
                this.setState({
                    ...this.state,
                    running: true
                });
                try {
                    let Objects = Object.values(res.data.data);
                    this.setState({
                        ...this.state,
                        totalLength: res.data.data.length
                    });

                    console.log('Working...');
                    for (let i = 0; i < Objects.length; i++) {
                        let data = Objects[i];
                        try {
                            let res = await this.makeRequest(`https://api.projectfly.co.uk/api/v3/bookings/${data.id}/details`);
                            let log = res.data.data;
                            let flight_number = log.flight_number.split('\/');
                            let aircraft = 0;
                            this.state.data[data.id] = {
                                "Booking": {
                                    "Departure_Icao": log.departure.icao,
                                    "Arrival_Icao":  log.arrival.icao,
                                    "Status": log.status_code,
                                    "Callsign": flight_number[0], 
                                    "Flight_Number": flight_number[1],
                                    "User_Aircraft": aircraft
                                },
                                "Flight": {
                                    "Time_Started": log.flight.time_started, 
                                    "Time_Ended": log.flight.time_ended,
                                    "Landing_Fpm": log.flight.landing_fpm, 
                                    "Status": 2
                                }
                            }
                        } catch (e) {
                            alert('Something wen\'t wrong (likely auth token refresh). We\'ve made the file for you anyway.');
                            this.finish();
                            return;
                        }

                        console.log(`Finished ${i + 1} of ${Objects.length}`);

                        if (i === Objects.length - 1) {
                            this.finish();
                        }

                        this.setState({
                            ...this.state,
                            currentLength: this.state.currentLength + 1
                        });
                    };
                } catch (e) {
                    alert('No data found.');
                }
            }
        } catch (e) {
            console.error(e);
            alert('Request Failed: Check console for more information. (Check the auth token?)');
        }
    }
    
    async makeRequest(url) {
        let request = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        });
    
        return request
    }

    async finish() {
        this.setState({
            ...this.state,
            running: false,
            done: true
        });
        let fileId = Math.random().toString(36).substr(2, 5);
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(this.state.data)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `Bookings_${fileId}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
}
