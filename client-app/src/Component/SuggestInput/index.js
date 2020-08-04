import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Suggest.scss';
import axios from 'axios';
import assert from 'power-assert';
import {debounce} from 'throttle-debounce';

export class SuggestInput extends Component {

    static propTypes = {
        minQuerySize: PropTypes.number,
        debounceTimeMs: PropTypes.number,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        minQuerySize: 2,
        debounceTimeMs: 50,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedSuggestionIndex: 0,
            suggestResult: [],
            showResult: false,
            searchInput: '',
            pendingSuggestion: null
        };

        this.fetchDebounced = debounce(this.props.debounceTimeMs, this.getSuggestionsByQuery);
    }

    async getSuggestionsByQuery(query = null) {

        if (query === null) {
            return [];
        }

        this.state.pendingSuggestion = query;
        const result = await axios.get(`http://localhost:5075/suggest?searchInput=${encodeURIComponent(query)}`);
        // const result = await axios.get(`${window.location.origin}/suggest?searchInput=${encodeURIComponent(query)}`);

        const status = result.status;
        if (status === 200 && this.state.pendingSuggestion !== null && this.state.pendingSuggestion === query) {
            assert(Array.isArray(result.data), 'should be an array');

            this.setState({
                suggestResult: result.data,
                showResult: true
            });
            this.state.pendingSuggestion = null;
            return result.data;
        }
        return null;
    }

    clearSuggestion() {
        this.setState({suggestResult: []});
    }

    onChange = (e) => {
        const {minQuerySize} = this.props;
        const searchInput = e.currentTarget.value || '';

        if (searchInput.length === 0) {
            this.clearSuggestion();
        }

        this.setState({searchInput}, () => {
            if ((searchInput.length >= minQuerySize)) {
                this.fetchDebounced(this.state.searchInput);
            }
        });

    };

    onClick = (e) => {
        this.setState({
            selectedSuggestionIndex: 0,
            suggestResult: [],
            showResult: false,
            searchInput: e.currentTarget.innerText
        });
    };

    onKeyDown = (e) => {
        const {selectedSuggestionIndex, suggestResult} = this.state;

        if (e.keyCode === 13) {
            this.setState({
                selectedSuggestionIndex: 0,
                showResult: false,
                searchInput: suggestResult[selectedSuggestionIndex]
            });
            this.onSubmit(suggestResult[selectedSuggestionIndex])
        }
    };

    onSubmit = () => {
        const {selectedSuggestionIndex, suggestResult} = this.state;
        this.props.onSubmit(suggestResult[selectedSuggestionIndex]);
        this.setState({
            selectedSuggestionIndex: selectedSuggestionIndex,
            showResult: false,
            searchInput: suggestResult[selectedSuggestionIndex]
        });
    };

    highlightText = (text, highlight) => {
        const fragments = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (<span> {
            fragments.map((fragment, i) =>
                <span key={i} className={fragment.toLowerCase() === highlight.toLowerCase() ? 'highlighted-text' : ''}>
                      {fragment}
                </span>
            )
        } </span>);
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            onSubmit,
            highlightText,
            state: {
                selectedSuggestionIndex,
                suggestResult,
                showResult,
                searchInput
            }
        } = this;

        return (
            <React.Fragment>
                <div className='suggest-input-wrapper'>
                    <div className='suggest-search-input-wrapper'>
                        <input
                            type='search'
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            value={searchInput}
                        />
                        <button onClick={onSubmit}>Search</button>
                    </div>
                    {
                        showResult && searchInput ?
                            suggestResult.length ?
                                (
                                    <ul className='suggestions'>
                                        {suggestResult.map((suggestion, index) => {
                                            let classNameActive;
                                            if (index === selectedSuggestionIndex) {
                                                classNameActive = 'active';
                                            }
                                            return (
                                                <li key={suggestion + index} onClick={onClick}
                                                    className={classNameActive}>
                                                    {highlightText(suggestion, searchInput)}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) :
                                (
                                    <div>
                                        <em>No results to show</em>
                                    </div>
                                )
                            : null
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default SuggestInput;
