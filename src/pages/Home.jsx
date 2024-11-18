import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, created_at, upvotes")
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <div className="posts-feed">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
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
