import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PostPage.css";

function PostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigating after deletion
  const [post, setPost] = useState(null);
  const [referencedPost, setReferencedPost] = useState(null); // Store referenced post details
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [secretKey, setSecretKey] = useState(""); // For validating actions
  const [editing, setEditing] = useState(false); // Track editing state
  const [updatedPost, setUpdatedPost] = useState({ title: "", description: "", imageURL: "" });

  // Fetch post details
  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(data);
      setComments(data.comments || []);

      // Fetch referenced post if referencedPostId exists
      if (data.referencedPostId) {
        const { data: refData, error: refError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", data.referencedPostId)
          .single();

        if (refError) {
          console.error("Error fetching referenced post:", refError);
          setReferencedPost(null); // Ensure no broken rendering
        } else {
          setReferencedPost(refData); // Set the referenced post
        }
      } else {
        setReferencedPost(null); // Clear referenced post if not set
      }
    } catch (err) {
      console.error("Unexpected error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  // Validate Secret Key
  const validateSecretKey = () => {
    const enteredKey = secretKey.trim();
    const storedKey = String(post?.secretKey || "").trim(); // Ensure valid access to the key
    return enteredKey === storedKey;
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
      const updatedComments = [...comments, newComment];

      const { error } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", id);

      if (error) {
        console.error("Error updating comments:", error);
        return;
      }

      setComments(updatedComments); // Update local comments state
      setNewComment(""); // Clear the input field
    } catch (err) {
      console.error("Unexpected error adding comment:", err);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (index) => {
    if (!validateSecretKey()) {
      alert("Invalid secret key. Unable to delete comment.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const updatedComments = comments.filter((_, i) => i !== index);

      const { error } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", id);

      if (error) {
        console.error("Error deleting comment:", error);
        return;
      }

      setComments(updatedComments); // Update local comments state
    } catch (err) {
      console.error("Unexpected error deleting comment:", err);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!validateSecretKey()) {
      alert("Invalid secret key. Unable to delete post.");
      return;
    }

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

  // Handle start editing
  const startEditing = () => {
    setEditing(true);
    setUpdatedPost({ title: post.title, description: post.description, imageURL: post.imageURL });
  };

  // Handle save changes
  const saveChanges = async () => {
    if (!validateSecretKey()) {
      alert("Invalid secret key. Unable to edit post.");
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .update(updatedPost)
        .eq("id", id);

      if (error) {
        console.error("Error saving changes:", error);
        alert("An error occurred while saving changes.");
      } else {
        alert("Post updated successfully!");
        setPost({ ...post, ...updatedPost }); // Update the local state
        setEditing(false);
      }
    } catch (err) {
      console.error("Unexpected error saving changes:", err);
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
      {referencedPost ? (
        <div className="referenced-post">
          <h2>Referenced Post</h2>
          <p>
            <Link to={`/post/${referencedPost.id}`}>{referencedPost.title}</Link>
          </p>
        </div>
      ) : null}

      <h1>{post.title}</h1>
      <p className="post-id">Post ID: {post.id}</p>
      {post.imageURL && <img src={post.imageURL} alt={post.title} className="post-image" />}
      <p>{post.description}</p>
      <p>Posted: {new Date(post.created_at).toLocaleString()}</p>
      <p>Upvotes: {post.upvotes}</p>

      <div className="secret-key-section">
        <h3>Enter Your Secret Key</h3>
        <input
          type="password"
          placeholder="Enter Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="secret-key-input"
        />
      </div>

      <div className="post-actions">
        <button onClick={handleUpvote}>Upvote</button>
        <button onClick={startEditing}>Edit</button>
        <button onClick={handleDeletePost}>Delete</button>
      </div>

      {editing ? (
        <div className="edit-form">
          <h3>Edit Post</h3>
          <input
            value={updatedPost.title}
            onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
          />
          <textarea
            value={updatedPost.description}
            onChange={(e) => setUpdatedPost({ ...updatedPost, description: e.target.value })}
          />
          <input
            value={updatedPost.imageURL}
            onChange={(e) => setUpdatedPost({ ...updatedPost, imageURL: e.target.value })}
          />
          <button onClick={saveChanges}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="comments-section">
  <h3>Comments</h3>
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <div className="comment" key={index}>
        <p>{comment}</p>
        <button
          onClick={() => handleDeleteComment(index)}
          className="delete-comment-button"
        >
          Delete
        </button>
      </div>
    ))
  ) : (
    <p>No comments yet. Be the first to comment!</p>
  )}
  <div className="comment-controls">
    <textarea
      className="comment-input"
      placeholder="Add a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    ></textarea>
    <button
      onClick={handleAddComment}
      className="add-comment-button"
    >
      Add Comment
    </button>
  </div>
</div>

      )}
    </div>
  );
}

export default PostPage;
