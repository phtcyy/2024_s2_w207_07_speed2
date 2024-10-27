import React, { useState, useEffect } from 'react'; // Import useEffect for client-side check
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from './css/Register.module.css'; // Import CSS module for styling

export default function Register() {
  const [email, setEmail] = useState(''); // State for storing email input
  const [password, setPassword] = useState(''); // State for storing password input
  const [role, setRole] = useState('Submitter'); // State for storing user role, default is "Submitter"
  const router = useRouter(); // Get the router object for navigation
  const [isClient, setIsClient] = useState(false); // State to track if rendering is happening on the client

  useEffect(() => {
    // Ensure the component only renders on the client
    setIsClient(true);
  }, []);

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send POST request to register the user
      const res = await fetch('/api/users/register', {
        method: 'POST', // Use POST method for registration
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ // Convert form data to JSON
          email,
          password,
          role,
        }),
      });

      // Check if the response is not okay
      if (!res.ok) {
        const errorData = await res.json(); // Parse error response
        console.log('Registration failed:', errorData.message); // Log error message
        alert('Registration failed, username has been used'); // Alert user about the failure
        return;
      }

      alert('Registration successful! You can now log in.'); // Alert user on successful registration
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error); // Log any errors
      alert('An error occurred during registration'); // Alert user about the error
    }
  };

  // Only render the component on the client side
  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.container}> {/* Container for registration form */}
      <h1>Register</h1> {/* Page title */}
      <form onSubmit={handleRegister} className={styles.form}> {/* Registration form */}
        <input
          type="email" // Input for email
          value={email} // Bind email state to input
          onChange={(e) => setEmail(e.target.value)} // Update email state on input change
          placeholder="Email" // Placeholder text
          required // Input is required
          className={styles.input} // CSS class for styling
        />
        <input
          type="password" // Input for password
          value={password} // Bind password state to input
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
          placeholder="Password" // Placeholder text
          required // Input is required
          className={styles.input} // CSS class for styling
        />
        <select
          value={role} // Bind role state to select
          onChange={(e) => setRole(e.target.value)} // Update role state on selection change
          className={styles.input} // CSS class for styling
        >
          <option value="Submitter">Submitter</option> {/* Role option */}
          <option value="Moderator">Moderator</option> {/* Role option */}
          <option value="Analyst">Analyst</option> {/* Role option */}
        </select>
        <button type="submit" className={styles.button}>Register</button> {/* Submit button */}
      </form>
    </div>
  );
}
