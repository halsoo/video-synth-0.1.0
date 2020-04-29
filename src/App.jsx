import React, { Component } from 'react';
import Header from './components/Header';
import P5Wrapper from './components/P5Wrapper';
import ControlPanel from './components/ControlPanel';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <P5Wrapper />
                <ControlPanel />
            </div>
        );
    }
}
