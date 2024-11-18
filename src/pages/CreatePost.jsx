import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const createPost = async () => {
    const secretKey = Math.floor(1000 + Math.random() * 9000);

    const { error } = await supabase.from("posts").insert([
      {
        title,
        description,
        imageURL: imageUrl,
        secretKey,
        upvotes: 0,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating post. Please try again.");
    } else {
      alert(`Post created! Save this secret key: ${secretKey}`);
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
      <button onClick={createPost}>Submit</button>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

export default CreatePost;
