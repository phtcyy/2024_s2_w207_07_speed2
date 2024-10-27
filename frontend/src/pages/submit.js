import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from './css/Submit.module.css'; // Import CSS module for styling
import Layout from './Layout'; // Import the Layout component for consistent page structure

export default function Submit() {
  const [article, setArticle] = useState({ // State to store article submission data
    title: '',
    isbn: '',
    author: '',
    description: '',
    published_date: '',
    publisher: '',
    doi: '',
  });

  const router = useRouter(); // Get the router object for navigation
  const [isClient, setIsClient] = useState(false); // State to check if the component is rendering on the client side

  useEffect(() => {
    setIsClient(true); // Set isClient to true after component mounts
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      // If no token is found, redirect to the login page
      router.push('/login');
    }
  }, [router]); // Run this effect when the router changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    const token = localStorage.getItem('token'); // Retrieve the token again
    if (!token) {
      alert('You must be logged in to submit an article.'); // Alert user if not logged in
      return;
    }

    console.log('Submitting Article:', article); // Log the article data to console for debugging

    // Send the article data to the API for submission
    const res = await fetch('/api/articles/submit', {
      method: 'POST', // Use POST method to submit the article
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(article), // Convert article data to JSON
    });
  
    if (res.ok) {
      alert('Article submitted successfully!'); // Alert on successful submission
      // Reset the article state to clear the form
      setArticle({
        title: '',
        isbn: '',
        author: '',
        description: '',
        published_date: '',
        publisher: '',
        doi: '',
      });
    } else {
      alert('Failed to submit article'); // Alert on failure
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    setArticle({
      ...article, // Spread the existing article data
      [name]: value, // Update the specific field being changed
    });
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div className={styles.container}> {/* Container for the submission form */}
        <h1>Submit an Article</h1> {/* Page title */}
        <form onSubmit={handleSubmit} className={styles.form}> {/* Submission form */}
          <input
            type="text"
            name="title" // Name attribute corresponds to the state property
            value={article.title} // Bind title state to input
            onChange={handleInputChange} // Handle input changes
            placeholder="Title" // Placeholder text
            required // Input is required
            className={styles.input} // CSS class for styling
          />
          <input
            type="text"
            name="isbn" // Name attribute corresponds to the state property
            value={article.isbn} // Bind ISBN state to input
            onChange={handleInputChange} // Handle input changes
            placeholder="ISBN" // Placeholder text
            required // Input is required
            className={styles.input} // CSS class for styling
          />
          <input
            type="text"
            name="author" // Name attribute corresponds to the state property
            value={article.author} // Bind author state to input
            onChange={handleInputChange} // Handle input changes
            placeholder="Author" // Placeholder text
            required // Input is required
            className={styles.input} // CSS class for styling
          />
          <textarea
            name="description" // Name attribute corresponds to the state property
            value={article.description} // Bind description state to textarea
            onChange={handleInputChange} // Handle input changes
            placeholder="Description" // Placeholder text
            required // Input is required
            className={styles.textarea} // CSS class for styling
          />
          <input
            type="date"
            name="published_date" // Name attribute corresponds to the state property
            value={article.published_date} // Bind published date state to input
            onChange={handleInputChange} // Handle input changes
            className={styles.input} // CSS class for styling
          />
          <input
            type="text"
            name="publisher" // Name attribute corresponds to the state property
            value={article.publisher} // Bind publisher state to input
            onChange={handleInputChange} // Handle input changes
            placeholder="Publisher" // Placeholder text
            required // Input is required
            className={styles.input} // CSS class for styling
          />
          <input
            type="text"
            name="doi" // Name attribute corresponds to the state property
            value={article.doi} // Bind DOI state to input
            onChange={handleInputChange} // Handle input changes
            placeholder="DOI" // Placeholder text
            required // Input is required
            className={styles.input} // CSS class for styling
          />
          <button type="submit" className={styles.button}>Submit</button> {/* Submit button */}
        </form>
      </div>
    </Layout>
  );
}
