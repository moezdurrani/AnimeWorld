// src/utils/timeAgo.js
export function timeAgo(timestamp) {
    const now = new Date();
    const postDate = new Date(timestamp);
    const seconds = Math.floor((now - postDate) / 1000);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
  
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} days ago`;
    }
  
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} weeks ago`;
    }
  
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} months ago`;
    }
  
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  }
  