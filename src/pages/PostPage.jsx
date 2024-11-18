import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PostPage.css";

function PostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigating after deletion
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
        console.error("Error fetching post:", error);
        setPost(null);
      } else {
        setPost(data);
        setComments(data.comments || []); // Initialize comments as an empty array if null
      }
    } catch (err) {
      console.error("Unexpected error fetching post:", err);
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

      // Append the new comment to the current comments array
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

      // Update local comments state and clear the input field
      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      console.error("Unexpected error adding comment:", err);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
      } else {
        alert("Post deleted successfully!");
        navigate("/"); // Navigate back to the home page
      }
    } catch (err) {
      console.error("Unexpected error deleting post:", err);
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
      <div className="post-actions">
        <button onClick={handleUpvote} className="upvote-button">Upvote</button>
        <button onClick={handleDeletePost} className="delete-button">Delete Post</button>
      </div>
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
