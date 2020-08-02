import React, {Component} from 'react';
import './App.css';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import CityList from './Component/CityList/index';

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={CityList}/>
            </Router>
        );
    }
}

export default App;
