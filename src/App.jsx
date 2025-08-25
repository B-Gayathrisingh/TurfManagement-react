import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import EditTurf from './pages/EditTurf';


function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />} 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin" 
            element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-turf/:id" 
            element={user && user.role === 'admin' ? <EditTurf /> : <Navigate to="/login" />} 
          />
          
          {/* Protected user routes */}
          <Route 
            path="/user" 
            element={user && user.role === 'user' ? <UserDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={user && user.role === 'user' ? <Cart /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/checkout" 
            element={user && user.role === 'user' ? <Checkout /> : <Navigate to="/login" />} 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;