import { useDropzone } from 'react-dropzone'
import React, { Component, useCallback } from 'react';
import './dropzone.css';

// To pass props to a functional component, pass them in as params
// and ignore the 'this' keyword when trying to access
// But pass them normally in the parent component
const FileUpload = (props) => {
    const maxSize = 3145728;

    const onDrop = useCallback(acceptedFile => {
      if (acceptedFile.length > 0) {
        props.uploadHandler(acceptedFile)
        console.log(acceptedFile);
      }
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
      onDrop,
      accept: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
      minSize: 0,
      maxSize,
      multiple: 0,
    });

    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    // TODO: Look up hooks, and CSS to style this, warning that cant drop more than 1 file at a time
    return (
      <div className="container text-center mt-5">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {!isDragActive && 'Click here or drop a file to upload!'}
          {isDragActive && !isDragReject && "Drop it like it's hot!"}
          {isDragReject && "File type not accepted, sorry!"}
          {isFileTooLarge && (
            <div className="text-danger mt-2">
              File is too large.
            </div>
          )}
        </div>
        <ul className="list-group mt-2">
          {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
            <li key={0} className="list-group-item list-group-item-success">
              {acceptedFile.name}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default FileUpload;
