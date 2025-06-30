import React, { useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import MusicLibrary from './components/MusicLibrary';
import LoginForm from './components/LoginForm';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (username, password) => {
    if (username === 'admin' && password === 'adminpass') {
      const newUser = { username: 'admin', role: 'admin', token: 'mock-admin-jwt' };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } else if (username === 'user' && password === 'userpass') {
      const newUser = { username: 'user', role: 'user', token: 'mock-user-jwt' };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? <MusicLibrary user={user} /> : <LoginForm />}
    </AuthContext.Provider>
  );
};

export default App;
