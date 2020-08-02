import React, {Component} from 'react';
import axios from 'axios';

export default class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
        };
        this.loadCities = this.getSuggestionsByQuery.bind(this);
    }

    componentWillMount() {
        this.loadCities();
    }

    async getSuggestionsByQuery(query = null) {
        const promise = await axios.get(`${window.location.origin}/suggest?searchInput${query}`);
        const status = promise.status;
        if (status === 200) {
            const data = promise.data;
            this.setState({cities: data});
        }
    }

    render() {
        return (
            <div>
                <h1>Cities</h1>
                {this.state.cities.map((value, index) => {
                    return <h4 key={index}>{value}</h4>
                })}
            </div>
        )
    }
}
