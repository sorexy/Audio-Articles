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

    uploadHandler = (file) => {
        // we are sending the file via multipart form data so we can
        // include the metadata like title
        // omit content type for sending files, will automatically add
        // multipart form data header
        console.log(file[0])

        // Makes the data act as a form when you send (key value pairs)
        var data = new FormData()
        data.append('title', file[0].name)
        data.append('file', file[0])
        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }

        fetch('http://localhost:8000/upload/', {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
            },
            body: data,
        })
          .then((response) => {
              if (response.ok) {
                  console.log("File Uploaded");
              } else {
                  // TODO: display a message upon failure, set something to True
                  // and && it with a component that says error
                  console.log("Failure");
              }
          })
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
                    <FileUpload uploadHandler={this.uploadHandler}></FileUpload>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
