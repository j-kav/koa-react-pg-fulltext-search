import React, { Component } from 'react';
import SuggestInput from '../SuggestInput';

class Home extends Component {

    onSearchSubmit = (selectData) => {
        // do nothing
    };

    render() {
        const { onSearchSubmit } = this;
        return (
            <div className="App">
                <SuggestInput onSubmit={onSearchSubmit}/>
            </div>
        );
    }
}

export default Home;
