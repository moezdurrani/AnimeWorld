import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { timeAgo } from "./timeAgo";
import "./Home.css";

function Home({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch posts from the database
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, created_at, imageURL, upvotes, description")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error fetching posts.");
    } else {
      setPosts(data);
      setFilteredPosts(data); // Initialize filteredPosts with all posts
    }
  };

  // Filter posts whenever the search query changes
  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <div className="posts-feed">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              {post.imageURL && (
                <img src={post.imageURL} alt={post.title} className="post-image" />
              )}
              <div className="post-content">
                <h3 className="post-title">
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="post-description">{post.description}</p>
                <div className="post-details">
                  <p>Posted: {timeAgo(post.created_at)}</p>
                  <div className="post-upvotes">
                    <span>👍</span> {post.upvotes} Upvotes
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
