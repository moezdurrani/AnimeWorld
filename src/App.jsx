import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-title">
            <Link to="/" className="title-link">AnimeHub</Link>
          </div>
          <div className="header-search">
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query on typing
            />
          </div>
          <div className="header-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/create" className="nav-link">Create a Post</Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} /> {/* Pass searchQuery */}
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
