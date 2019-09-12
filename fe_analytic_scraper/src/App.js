import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Searchbar from './components/search_bar';

import { connect } from 'react-redux';
import { update } from './actions/search_bar';

function mapStateToProps(state) {
    return {
        state: state.mySb
    }
}

function mapDispatchToProps(dispatch) {
    return {
        update: (data) => dispatch(update(data))
    }
}

class App extends Component {
    changeHandler = (event) => {
        this.props.update(event)
        console.log(this.props.state)
    }

    render() {
        return (
            <div className="App">
                <div className="Intro">
                    <h1>Welcome to the YouTube Scraper</h1>
                    <h3>Please enter a channel to scrape data from</h3>
                </div>
                <div className="Searchbar">
                    <Searchbar changeHandler={this.changeHandler}></Searchbar>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
