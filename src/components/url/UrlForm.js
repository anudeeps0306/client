import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUrl } from '../../redux/urlSlice';

const UrlForm = () => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expirationDate: ''
  });
  
  const { loading, error } = useSelector(state => state.url);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { originalUrl, customAlias, expirationDate } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const resultAction = await dispatch(createUrl(formData));
    if (createUrl.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Short URL</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="originalUrl">
            Original URL *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="originalUrl"
            type="url"
            placeholder="https://example.com"
            name="originalUrl"
            value={originalUrl}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customAlias">
            Custom Alias (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customAlias"
            type="text"
            placeholder="my-custom-url"
            name="customAlias"
            value={customAlias}
            onChange={onChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to generate a random code
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expirationDate">
            Expiration Date (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="expirationDate"
            type="datetime-local"
            name="expirationDate"
            value={expirationDate}
            onChange={onChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrlForm;