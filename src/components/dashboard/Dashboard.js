import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUrls, deleteUrl } from '../../redux/urlSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { urls, loading } = useSelector(state => state.url);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 5;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    dispatch(fetchUrls());
  }, [dispatch]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      await dispatch(deleteUrl(id));
      dispatch(fetchUrls());
    }
  }, [dispatch]);

  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(filteredUrls.length / urlsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your URLs</h1>
        <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Create New URL
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search URLs..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {currentUrls.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No URLs found. Create your first shortened URL!</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Original URL</th>
                  <th className="px-4 py-2 text-left">Short URL</th>
                  <th className="px-4 py-2 text-center">Clicks</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUrls.map(url => (
                  <tr key={url._id} className="border-t">
                    <td className="px-4 py-2 truncate max-w-xs">
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <a href={`${baseUrl}/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {url.shortCode}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-center">{url.clicks}</td>
                    <td className="px-4 py-2">{new Date(url.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">
                      {url.expiresAt && new Date(url.expiresAt) < new Date() ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expired</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/url/${url._id}`}>
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">View</button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(url._id)} 
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={`page-${i}`} className="mx-1">
                      <button
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;