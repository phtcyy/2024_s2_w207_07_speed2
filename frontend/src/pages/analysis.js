import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Import the Layout component for consistent page structure

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]); // State to store articles awaiting analysis
  const [isClient, setIsClient] = useState(false); // State to check if rendering is happening on the client side

  useEffect(() => {
    setIsClient(true); // Ensure the component only renders on the client side

    // Fetch articles from the API when the component mounts
    fetch('/api/articles/analysis')  // Ensure the API path is correct
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        return res.json();
      })
      .then(data => setArticles(data))
      .catch(err => {
        console.error(err);
        alert('Failed to load analysis queue');
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  // Submit analysis result for a specific article
  const handleSubmitAnalysis = async (id, result) => {
    try {
      const res = await fetch(`/api/articles/analysis/${id}`, {
        method: 'PUT', // Use PUT method to update the analysis result
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify({ analysisResult: result }), // Use "approved" or "rejected" as analysis result
      });

      if (res.ok) {
        // Optimistically update the UI by removing the article
        setArticles(articles.filter(article => article._id !== id)); // Update the articles state
      } else {
        alert('Failed to submit analysis'); // Alert user on failure
      }
    } catch (error) {
      console.error('Error during analysis submission:', error);
      alert('An error occurred while submitting the analysis.');
    }
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div>
        <h1>Analysis Queue</h1> {/* Page title */}
        {articles.length > 0 ? (
          <ul>
            {articles.map(article => (
              <li key={article._id}> {/* Unique key for each list item */}
                <h2>{article.title}</h2> {/* Article title */}
                <p>{article.description}</p> {/* Article description */}

                {/* Buttons to approve or reject the article */}
                <button onClick={() => handleSubmitAnalysis(article._id, 'approved')}>
                  Approve
                </button>
                <button onClick={() => handleSubmitAnalysis(article._id, 'rejected')}>
                  Reject
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles awaiting analysis.</p> // Message when no articles are available
        )}
      </div>
    </Layout>
  );
}
