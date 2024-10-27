// pages/login.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/Login.module.css'; // 确保你有正确的 CSS 文件

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 确保组件在客户端渲染
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/'); // 如果已经登录，重定向到主页
    }
  }, [router]);

  // 处理登录请求
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/login', { // 确保这是你的后端地址
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Login failed:', errorData.message);
        alert('Login failed: ' + errorData.message);
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);

      const decodedToken = decodeToken(data.token);
      const userRole = decodedToken.role;

      // 根据用户角色重定向
      if (userRole === 'Moderator') {
        router.push('/moderation');
      } else if (userRole === 'Analyst') {
        router.push('/analysis');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  // 解码 JWT
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  if (!isClient) {
    return null; // 只在客户端渲染
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to SPEED Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.text}>
        Don&apos;t have an account?{' '}
        <Link href="/register">
          <a className={styles.link}>Register here</a>
        </Link>
      </p>
    </div>
  );
}
