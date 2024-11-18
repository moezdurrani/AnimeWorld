import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./Home.css"; // For styling

function Home() {
  const [posts, setPosts] = useState([]);

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
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <div className="posts-feed">
        {posts.length > 0 ? (
          posts.map((post) => (
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
                  <p>Posted: {new Date(post.created_at).toLocaleString()}</p>
                  <div className="post-upvotes">
                    <span>👍</span> {post.upvotes} Upvotes
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
