import React from 'react';
import logo from './logo.svg';
import './App.css';

import Searchbar from './components/search_bar';

function App() {
  return (
    <div className="App">
        <div className="Intro">
            <h1>Welcome to the YouTube Scraper</h1>
            <h3>Please enter a channel to scrape data from</h3>
        </div>
        <div className="Searchbar">
            <Searchbar></Searchbar>
        </div>
    </div>
  );
}

export default App;
