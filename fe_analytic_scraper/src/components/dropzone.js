import Dropzone from 'react-dropzone'
import React, { Component } from 'react';
import './dropzone.css';

class FileUpload extends Component {
    render() {
        return (
            <div className="dropzone">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                <Dropzone
                    onDrop={droppedFiles => console.log(droppedFiles)}
                    maxSize={3145728}
                    accept={['.pdf', '.doc', '.docx', '.txt', '.rtf']} >
                    {/* TODO: check file context for only text
                              Alert when file too big and invalid file
                              Add a preview
                              fetch api to send to BE and parse
                              Make a cost calculator and return it after upload
                              Read the first few words (in char) aloud for free trial in audio on site
                              After pay, download */}
                    {({getRootProps, getInputProps}) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                            <div className="dz-message d-flex flex-column">
                                <i className="material-icons text-muted">cloud_upload</i>
                              Drag &amp; Drop here or click
                            </div>
                          </div>
                      </section>
                    )}
                </Dropzone>
            </div>
        );
    }
}

export default FileUpload;
