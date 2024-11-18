import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, created_at, imageURL, upvotes")
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
              <h3>
                <Link to={`/post/${post.id}`}>{post.title}</Link> {/* Link to PostPage */}
              </h3>
              {post.imageURL && (
                <img src={post.imageURL} alt={post.title} className="post-image" />
              )}
              <p>Posted: {new Date(post.created_at).toLocaleString()}</p>
              <p>{post.upvotes} upvotes</p>
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
