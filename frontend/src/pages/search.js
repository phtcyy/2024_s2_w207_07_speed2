import React, { useState, useEffect } from 'react';
import styles from './css/Search.module.css'; // Import CSS module for styling
import Layout from './Layout'; // Import the Layout component for consistent page structure

export default function Search() {
  const [query, setQuery] = useState(''); // State to store the search query
  const [results, setResults] = useState([]); // State to store search results
  const [isClient, setIsClient] = useState(false); // State to check if rendering is happening on the client side

  useEffect(() => {
    setIsClient(true); // Ensure the component only renders on the client side
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const res = await fetch(`/api/articles/search?q=${query}`); // Fetch search results from the API
    if (res.ok) {
      const data = await res.json(); // Parse the response JSON
      setResults(data); // Update the state with the search results
    } else {
      alert('Failed to search articles'); // Alert user on failure
    }
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div className={styles.container}> {/* Container for the search form and results */}
        <h1>Search Articles</h1> {/* Page title */}
        <form onSubmit={handleSearch} className={styles.form}> {/* Search form */}
          <input
            type="text" // Input type for search keyword
            value={query} // Bind query state to input
            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            placeholder="Enter search keyword" // Placeholder text
            className={styles.input} // CSS class for styling
          />
          <button type="submit" className={styles.button}>Search</button> {/* Submit button */}
        </form>

        <ul className={styles.results}> {/* List for displaying search results */}
          {results.length > 0 ? ( // Check if there are any results
            results.map(article => ( // Map through search results to create list items
              <li key={article._id} className={styles.resultItem}> {/* Unique key for each list item */}
                <h2>{article.title}</h2> {/* Article title */}
                <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p> {/* Display DOI with link if available */}
              </li>
            ))
          ) : (
            <p className={styles.noResults}>No results found</p> // Message displayed if there are no results
          )}
        </ul>
      </div>
    </Layout>
  );
}
