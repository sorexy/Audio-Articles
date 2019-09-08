//API for MDBReact: https://mdbootstrap.com/docs/react/forms/search/


import React, { Component } from 'react';
import { MDBCol, MDBIcon } from "mdbreact";

import { connect } from 'react-redux';
import { update } from '../actions/search_bar';

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

class Searchbar extends Component {
    // TODO: make this redux state
    changeHandler = (event) => {
        this.props.update(event)
        // this seems a bit delayed, because update event is asynchronous and is slower
        // than just to console log
        console.log(this.props.state)
    }

    render() {
        return (
            <MDBCol md="6">
              <div className="input-group md-form form-sm form-1 pl-0">
                <div className="input-group-prepend">
                  <span className="input-group-text purple lighten-3" id="basic-text1">
                    <MDBIcon className="text-white" icon="search" />
                  </span>
                </div>
                <input
                    className="form-control my-0 py-1"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={(event) => this.changeHandler(event.target.value)}
                />
                {/* cannot use just pass in the event to store, need to extract value */}
              </div>
            </MDBCol>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);
