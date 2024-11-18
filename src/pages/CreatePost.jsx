import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [secretKey, setSecretKey] = useState(""); // New state for the secret key
  const navigate = useNavigate();

  const createPost = async () => {
    if (!title.trim() || !description.trim() || !secretKey.trim()) {
      alert("Please fill in all required fields, including the secret key.");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        description,
        imageURL: imageUrl,
        secretKey,
        upvotes: 0,
        comments: [], // Initialize comments as an empty array
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating post. Please try again.");
    } else {
      alert("Post created successfully!");
      navigate("/"); // Redirect to the home page
    }
  };

  return (
    <div className="create-post">
      <h1>Create a New Post</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="password" // Use password input type to hide the key
        placeholder="Create a Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        required
      />
      <button onClick={createPost}>Submit</button>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

export default CreatePost;
