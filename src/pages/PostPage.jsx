import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PostPage.css";

function PostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch post details
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      {post.imageURL && <img src={post.imageURL} alt={post.title} className="post-image" />}
      <p>{post.description}</p>
      <p>Posted: {new Date(post.created_at).toLocaleString()}</p>
      <p>Upvotes: {post.upvotes}</p>
    </div>
  );
}

export default PostPage;
