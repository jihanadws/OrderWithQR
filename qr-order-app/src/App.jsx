import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Receipt from './components/Receipt';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/menu" element={<Landing />} />
            <Route path="/menu/:tableNumber" element={<Menu />} />
            <Route path="/cart/:tableNumber" element={<Cart />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />
            <Route path="*" element={<Navigate to="/menu?meja=01" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;