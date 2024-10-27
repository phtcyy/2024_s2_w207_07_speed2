import Link from 'next/link'; // Import Link for navigation between pages
import { useState, useEffect, useCallback } from 'react'; // Import React hooks for state and lifecycle management
import { useRouter } from 'next/router'; // Import useRouter for programmatic navigation
import styles from './Layout.module.css'; // Import CSS module for styling

export default function Layout({ children, hideMenu }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userRole, setUserRole] = useState(null); // State to track the user's role
  const router = useRouter(); // Get the router object for navigation

  // Handle user logout (wrapped in useCallback to avoid being a new function every render)
  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // Remove the token from local storage
    }
    setIsLoggedIn(false); // Set login status to false
    setUserRole(null); // Clear user role
    router.push('/login'); // Redirect to the login page
  }, [router]); // Add router as dependency since it's used inside the function

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure code runs only on client side
      const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
      if (token) {
        try {
          const decodedToken = decodeToken(token); // Decode the token to get user information
          setIsLoggedIn(true); // Set login status to true
          setUserRole(decodedToken.role); // Set user role from the decoded token
        } catch (error) {
          console.error('Invalid token:', error); // Log token error
          handleLogout(); // Logout if the token is invalid or decoding fails
        }
      }
    }
  }, [handleLogout]); // Now include handleLogout as a dependency

  // Manually decode JWT token
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1]; // Get the payload from the token
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert to base64 format
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); // Decode base64 to JSON format
    }).join(''));
    return JSON.parse(jsonPayload); // Parse the JSON string to an object
  };

  return (
    <div>
      <header className={styles.header}> {/* Header section */}
        {!hideMenu && ( // Conditionally render the menu based on hideMenu prop
          <nav className={styles.navbar}>
            <ul className={styles.navList}> {/* Navigation list */}
              <li>
                <Link href="/">Home</Link> {/* Home link */}
              </li>
              <li>
                <Link href="/articles">Articles</Link> {/* Articles link */}
              </li>
              <li>
                <Link href="/search">Search</Link> {/* Search link */}
              </li>
              <li>
                <Link href="/submit">Submit Article</Link> {/* Submit article link */}
              </li>
              {isLoggedIn ? ( // Check if the user is logged in
                <>
                  <li className={styles.userRole}>
                    <span>{`Logged in as: ${userRole}`}</span> {/* Display user role */}
                  </li>
                  <li>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button> {/* Logout button */}
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">Login</Link> {/* Login link */}
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.mainContent}> {/* Main content area */}
        {children} {/* Render child components */}
      </main>
    </div>
  );
}
