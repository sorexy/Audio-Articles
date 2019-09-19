import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Searchbar from './components/search_bar';
import FileUpload from './components/dropzone';

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

    submitHandler = () => {
        var title = prompt("What would you like to save the output as? (.mp3)", "Default")

        fetch('http://localhost:8000/input/', {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'applicaiton/json',
            },
            body: JSON.stringify({
                title: title,
                link: this.props.state
            }),
        })
          .then((response) => { console.log("Received raw response") })
          .then((resJson) => { alert('Response Getto! (Video Complete)'); })
        console.log("submitted " + this.props.state)


    }

    uploadHandler = () => {

    }

    render() {
        return (
            <div className="App">
                <div className="Intro">
                    <h1>Welcome to the Article Parser</h1>
                    <h3>Please enter an article URL</h3>
                </div>
                <div className="Searchbar">
                    <Searchbar changeHandler={this.changeHandler} submitHandler = {this.submitHandler}></Searchbar>
                </div>
                <div>
                    <h5 style={{marginTop: 20}}>or</h5>
                </div>
                <div>
                    <FileUpload></FileUpload>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
