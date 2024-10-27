import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Import the Layout component for consistent page structure

export default function ModerationQueue() {
  const [articles, setArticles] = useState([]); // State to store articles awaiting moderation
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [processing, setProcessing] = useState({}); // State to manage article-specific processing status

  useEffect(() => {
    // Fetch articles from the moderation API when the component mounts
    fetch('/api/articles/moderation')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        return res.json();
      })
      .then(data => setArticles(data))
      .catch(err => {
        console.error(err);
        alert('Failed to load moderation queue');
      })
      .finally(() => setLoading(false)); // Set loading to false once fetching is done
  }, []);

  // Approve an article
  const handleApprove = async (id) => {
    setProcessing((prev) => ({ ...prev, [id]: true })); // Set processing to true for this article
    try {
      const res = await fetch(`/api/articles/moderation/${id}`, {
        method: 'PUT', // Use PUT method to approve the article
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify({ action: 'approve' }), // Send approval action in the request body
      });

      if (!res.ok) {
        throw new Error('Failed to approve article');
      }

      // Update the local state by removing the approved article from the list
      setArticles((prevArticles) => prevArticles.filter(article => article._id !== id)); // Remove the processed article from the list
    } catch (error) {
      console.error(error);
      alert('Failed to approve article');
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false })); // Reset processing status for this article
    }
  };

  // Reject an article
  const handleReject = async (id) => {
    setProcessing((prev) => ({ ...prev, [id]: true })); // Set processing to true for this article
    try {
      const res = await fetch(`/api/articles/moderation/${id}`, {
        method: 'PUT', // Use PUT method to reject the article
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify({ action: 'reject' }), // Send rejection action in the request body
      });

      if (!res.ok) {
        throw new Error('Failed to reject article');
      }

      // Update the local state by removing the rejected article from the list
      setArticles((prevArticles) => prevArticles.filter(article => article._id !== id)); // Remove the processed article from the list
    } catch (error) {
      console.error(error);
      alert('Failed to reject article');
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false })); // Reset processing status for this article
    }
  };

  if (loading) {
    return <Layout><p>Loading moderation queue...</p></Layout>; // Display loading message while fetching articles
  }

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div>
        <h1>Moderation Queue</h1> {/* Page title */}
        {articles.length > 0 ? (
          <ul>
            {articles.map(article => ( // Map through the articles awaiting moderation to create list items
              <li key={article._id}> {/* Unique key for each list item */}
                <h2>{article.title}</h2> {/* Article title */}
                <p>{article.description}</p> {/* Article description */}
                {/* Approval and rejection buttons */}
                <button 
                  onClick={() => handleApprove(article._id)} 
                  disabled={processing[article._id]} // Disable button if the article is being processed
                >
                  {processing[article._id] ? 'Approving...' : 'Approve'} {/* Show status in button */}
                </button>
                <button 
                  onClick={() => handleReject(article._id)} 
                  disabled={processing[article._id]} // Disable button if the article is being processed
                >
                  {processing[article._id] ? 'Rejecting...' : 'Reject'} {/* Show status in button */}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles awaiting moderation.</p> // Message when no articles are available
        )}
      </div>
    </Layout>
  );
}
