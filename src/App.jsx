import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-title">
            <Link to="/" className="title-link">AnimeHub</Link>
          </div>
          <div className="header-search">
            <input type="text" placeholder="Search..." className="search-bar" />
          </div>
          <div className="header-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/create" className="nav-link">Create a Post</Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
