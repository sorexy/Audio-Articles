//API for MDBReact: https://mdbootstrap.com/docs/react/forms/search/


import React, { Component } from 'react';
import { MDBCol, MDBIcon } from "mdbreact";

class Searchbar extends Component {
    // TODO: make this redux state
    changeHandler = event => {
        alert('change!')
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
                    onChange={this.changeHandler}
                />
              </div>
            </MDBCol>
        );
    }

}

export default Searchbar;
