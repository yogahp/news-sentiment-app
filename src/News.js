import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchNewsSentiment } from './apiService';
import { FaRegCalendarAlt, FaRegSmile, FaUser, FaExternalLinkAlt } from 'react-icons/fa';

Modal.setAppElement('#root');

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNewsSentiment();
        console.log('API Response:', data); // Debugging: Log API response
        setNews(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news sentiment data:', error);
        setLoading(false);
      }
    };
    getNews();
  }, []);

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
      case 'somewhat-bullish':
        return 'text-green-600';
      case 'bearish':
      case 'somewhat-bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Latest News & Sentiments</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news && news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card p-5 border rounded shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white" onClick={() => openModal(article)}>
                <h2 className="text-xl font-semibold mb-2">{truncateText(article.title, 50)}</h2>
                <p className="text-gray-700 mb-4">{truncateText(article.summary, 100)}</p>
                <p className={`font-medium ${getSentimentColor(article.overall_sentiment_label)}`}>Sentiment: {article.overall_sentiment_label}</p>
              </div>
            ))
          ) : (
            <p>No news articles available.</p>
          )}
        </div>
      )}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onRequestClose={closeModal}
          contentLabel="Article Details"
          className="relative bg-white p-5 rounded shadow-lg max-w-2xl mx-auto overflow-y-auto max-h-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-t">{selectedArticle.title}</h2>
            <img src={selectedArticle.banner_image} alt={selectedArticle.title} className="w-full h-auto mb-4 rounded" />
            <div className="px-4 space-y-4">
              <p className="text-gray-800">{selectedArticle.summary}</p>
              <div className="text-gray-600 flex items-center"><FaRegCalendarAlt className="mr-2" /> Published at: {selectedArticle.time_published}</div>
              <div className={`text-gray-600 flex items-center ${getSentimentColor(selectedArticle.overall_sentiment_label)}`}><FaRegSmile className="mr-2" /> Sentiment: {selectedArticle.overall_sentiment_label}</div>
              <div className="text-gray-600 flex items-center"><FaRegSmile className="mr-2" /> Sentiment Score: {selectedArticle.overall_sentiment_score}</div>
              <div className="text-gray-600 flex items-center"><FaUser className="mr-2" /> Authors: {selectedArticle.authors.join(', ')}</div>
              <div className="text-gray-600 flex items-center"><FaExternalLinkAlt className="mr-2" /> Source: {selectedArticle.source}</div>
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Read more</a>
            </div>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default News;
