import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [referencedPostId, setReferencedPostId] = useState(""); // For referencing another post
  const [secretKey, setSecretKey] = useState(""); // For user-defined secret key
  const navigate = useNavigate();

  const createPost = async () => {
    if (!title.trim() || !secretKey.trim()) {
      alert("Title and secret key are required!");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        description,
        imageURL: imageUrl,
        referencedPostId: referencedPostId || null, // Save referenced post ID if provided
        secretKey,
        upvotes: 0,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating post. Please try again.");
    } else {
      alert("Post created successfully!");
      navigate("/");
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
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Referenced Post ID (optional)"
        value={referencedPostId}
        onChange={(e) => setReferencedPostId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Set a Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <button onClick={createPost}>Submit</button>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

export default CreatePost;
