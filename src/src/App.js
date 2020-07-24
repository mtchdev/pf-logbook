import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as axios from 'axios';
import Main from './components/Main';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>projectFLY Logbook Exporter (<strong>STKP</strong>)</h3>
        <span className="description">This web app allows you to export your projectFLY data into the SimToolKitPro format.</span>
        <Main />

        <div className="disclaimer">
          <span>This website is not affiliated with projectFLY.</span>
          <span>Source Code: <a href="https://github.com/mtchdev/pf-logbook" target="_BLANK">GitHub</a></span>
          <span>No form data is ever sent to a server or database, all processing is done locally.</span>
          <span className="danger"><strong>Never share your auth token with anyone.</strong></span>
        </div>

        <div className="thanks">
          Special thanks to mtchdev & AndrewTech & webdes03
        </div>
      </header>
    </div>
  );
}

export default App;
