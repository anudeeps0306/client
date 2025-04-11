import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Navbar = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const authLinks = (
    <>
      <Link to="/dashboard" className="text-white mr-4 hover:text-blue-200">Dashboard</Link>
      <Link to="/create" className="text-white mr-4 hover:text-blue-200">Create URL</Link>
      <button onClick={onLogout} className="text-white hover:text-blue-200">Logout</button>
    </>
  );

  return (
    <nav className="bg-blue-600 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">URL Shortener</Link>
        <div>
          {isAuthenticated ? authLinks : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;