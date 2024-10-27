import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Import the Layout component for consistent page structure
import styles from './css/Bookmarks.module.css'; // Import CSS module for styling

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]); // State to store bookmarked articles
  const [isClient, setIsClient] = useState(false); // State to check if the component is running on the client side

  useEffect(() => {
    setIsClient(true); // Ensure the component is only rendered on the client side

    // Retrieve bookmarks from local storage when the component mounts
    if (typeof window !== 'undefined') { // Check if `window` is defined
      const storedBookmarks = localStorage.getItem('bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks)); // Parse and set bookmarks if they exist
      }
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Specify date format options
    return new Date(dateString).toLocaleDateString(undefined, options); // Convert date to local format
  };

  // Remove a bookmark by article ID
  const removeBookmark = (articleId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      // Filter out the bookmark to be removed
      const updatedBookmarks = bookmarks.filter((article) => article._id !== articleId);
      setBookmarks(updatedBookmarks); // Update state with the filtered bookmarks
      // Update local storage with the new bookmarks list
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div className={styles.container}> {/* Container for bookmarks */}
        <h1>Your Bookmarked Articles</h1> {/* Page title */}
        {bookmarks.length > 0 ? ( // Check if there are any bookmarks to display
          <div className={styles.articleList}>
            <ul>
              {bookmarks.map((article) => ( // Map through bookmarked articles to create list items
                <li key={article._id} className={styles.articleItem}> {/* Unique key for each list item */}
                  <p><strong>Title:</strong> {article.title}</p> {/* Article title */}
                  <p><strong>Author:</strong> {article.author}</p> {/* Article author */}
                  <p><strong>Description:</strong> {article.description ? article.description : 'No description available'}</p> {/* Article description */}
                  <p><strong>Published Date:</strong> {article.published_date ? formatDate(article.published_date) : 'No published date available'}</p> {/* Article published date */}
                  <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p> {/* Article DOI */}
                  
                  {/* Remove bookmark button */}
                  <button
                    className={styles.articleButton}
                    onClick={() => removeBookmark(article._id)} // Call removeBookmark with the article's ID
                  >
                    Remove Bookmark
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No bookmarked articles found</p> // Message displayed if there are no bookmarks
        )}
      </div>
    </Layout>
  );
}
