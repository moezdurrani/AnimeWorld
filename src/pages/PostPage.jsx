import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PostPage.css";

function PostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post details
  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
  
      if (error) {
        console.error("Error fetching post:", error); // Log errors to see if it's a query issue
        setPost(null);
      } else {
        console.log("Fetched post:", data); // Log the data to verify it's correct
        setPost(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching post:", err); // Log unexpected errors
    } finally {
      setLoading(false);
    }
  };
  

  // Handle upvote
  const handleUpvote = async () => {
    if (!post) return;

    const { error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", id);

    if (error) {
      console.error("Error upvoting post:", error);
    } else {
      setPost({ ...post, upvotes: post.upvotes + 1 }); // Update the local state
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      // Fetch the current comments from the database
      const { data: currentPost, error: fetchError } = await supabase
        .from("posts")
        .select("comments")
        .eq("id", id)
        .single();
  
      if (fetchError) {
        console.error("Error fetching current comments:", fetchError);
        return;
      }
  
      // Append the new comment to the current comments
      const updatedComments = [...(currentPost.comments || []), newComment];
  
      // Update the comments column in the database
      const { error: updateError } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", id);
  
      if (updateError) {
        console.error("Error updating comments:", updateError);
        return;
      }
  
      // Update the local comments state and clear the input
      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      console.error("Unexpected error adding comment:", err);
    }
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
      <button onClick={handleUpvote} className="upvote-button">Upvote</button>

      <div className="comments-section">
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment, index) => <p key={index}>{comment}</p>)
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        ></textarea>
        <button onClick={handleAddComment} className="add-comment-button">
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default PostPage;