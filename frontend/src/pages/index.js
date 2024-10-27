import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link for navigation
import Layout from './Layout'; // Import your Layout component
import styles from './css/Home.module.css'; // Import styles for your component

export default function Home() {
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const [articles, setArticles] = useState([]); // State to hold articles
  const [isClient, setIsClient] = useState(false); // State to check if running on the client side
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Mark that the component is running on the client side

    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login if token is invalid
          }
        })
        .then((data) => {
          if (data && data.role) {
            setUserRole(data.role); // Set user role based on fetched data
            if (data.role === 'Submitter') {
              // Fetch articles if user role is Submitter
              fetch('/api/articles')
                .then((res) => res.json())
                .then((articleData) => {
                  setArticles(Array.isArray(articleData) ? articleData : []); // Ensure articleData is an array
                })
                .catch(() => setArticles([])); // Set articles to empty array on error
            }
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login'); // Redirect to login on fetch error
        });
    } else {
      router.push('/login'); // Redirect to login if no token is found
    }
  }, [router]);

  // Function to bookmark an article
  const bookmarkArticle = (article) => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    const bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];
    const isAlreadyBookmarked = bookmarksArray.some((bookmark) => bookmark._id === article._id);

    if (!isAlreadyBookmarked) {
      const newBookmarks = [...bookmarksArray, article];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      alert('Article bookmarked!'); // Notify user
    } else {
      alert('This article is already bookmarked.'); // Notify user
    }
  };

  // Function to export an article
  const exportArticle = (article) => {
    const articleData = `
      Title: ${article.title}
      Author: ${article.author}
      DOI: ${article.doi}
      Description: ${article.description}
      Published Date: ${article.published_date}
    `;
    const blob = new Blob([articleData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.title}.txt`; // Set filename
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up
  };

  // Prevent rendering until the component is on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome to SPEED</h1>
          {userRole && (
            <div className={styles.login}>
              <span>{userRole}</span> {/* Display user role */}
            </div>
          )}
        </header>

        <main className={styles.main}>
          {userRole === 'Submitter' && (
            <div>
              <h2>Recent Articles</h2>
              {articles.length > 0 ? (
                <div className={styles.articleList}>
                  <ul>
                    {articles.map((article) => (
                      <li key={article._id} className={styles.articleItem}>
                        <p><strong>Title:</strong> {article.title}</p>
                        <p><strong>Author:</strong> {article.author}</p>
                        <p><strong>Description:</strong> {article.description || 'No description available'}</p>
                        <p><strong>Published Date:</strong> {article.published_date ? new Date(article.published_date).toLocaleDateString() : 'No date available'}</p>
                        <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p>
                        
                        <div className={styles.buttonContainer}>
                          <button 
                            className={styles.articleButton} 
                            onClick={() => bookmarkArticle(article)}
                          >
                            Bookmark
                          </button>

                          <button 
                            className={styles.articleButton} 
                            onClick={() => exportArticle(article)}
                          >
                            Export
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No recent articles available</p>
              )}
            </div>
          )}
          {!userRole && <p>Loading...</p>}

          {/* Add bookmarks page link */}
          <Link href="/bookmarks">
            View Bookmarks
          </Link>
        </main>
      </div>
    </Layout>
  );
}
