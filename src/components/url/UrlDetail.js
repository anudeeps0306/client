import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrlAnalytics } from '../../redux/urlSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { QRCodeSVG } from 'qrcode.react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UrlDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector(state => state.url);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUrlAnalytics(id));
    }
  }, [dispatch, id]);

  const handleCopyUrl = () => {
    const shortUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${analytics?.url?.shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  const { url, clicksOverTime, deviceBreakdown, browserBreakdown } = analytics;
  
  // Format data for charts
  const timeChartData = {
    labels: clicksOverTime.map(item => item.date),
    datasets: [
      {
        label: 'Clicks',
        data: clicksOverTime.map(item => item.clicks),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const deviceChartData = {
    labels: deviceBreakdown.map(item => item.device),
    datasets: [
      {
        label: 'Devices',
        data: deviceBreakdown.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const browserChartData = {
    labels: browserBreakdown.map(item => item.browser),
    datasets: [
      {
        label: 'Browsers',
        data: browserBreakdown.map(item => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const shortUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${url.shortCode}`;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">URL Analytics</h1>
      
      {/* URL Information */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Original URL:</h3>
            <a 
              href={url.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {url.originalUrl}
            </a>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Short URL:</h3>
            <div className="flex items-center">
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mr-2"
              >
                {shortUrl}
              </a>
              <button 
                onClick={handleCopyUrl}
                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Created:</h3>
            <p>{new Date(url.createdAt).toLocaleString()}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Expires:</h3>
            <p>
              {url.expiresAt 
                ? new Date(url.expiresAt).toLocaleString() 
                : 'Never'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Total Clicks:</h3>
            <p className="text-xl font-bold text-blue-600">{url.clicks}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Status:</h3>
            <p>
              {url.expiresAt && new Date(url.expiresAt) < new Date() 
                ? <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expired</span>
                : <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* QR Code */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">QR Code</h2>
        <div className="bg-white p-4 inline-block rounded shadow-md">
          <QRCodeSVG 
            value={shortUrl} 
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        
        {url.clicks === 0 ? (
          <p className="text-gray-500">No click data available yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clicks Over Time */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-medium mb-4">Clicks Over Time</h3>
              <div className="h-64">
                <Line 
                  data={timeChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Device Breakdown */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-medium mb-4">Device Breakdown</h3>
              <div className="h-64">
                <Pie 
                  data={deviceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            
            {/* Browser Breakdown */}
            <div className="bg-white p-4 rounded shadow lg:col-span-2">
              <h3 className="text-lg font-medium mb-4">Browser Breakdown</h3>
              <div className="h-64">
                <Bar 
                  data={browserChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlDetail;