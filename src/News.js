import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchNewsSentiment } from './apiService';

Modal.setAppElement('#root');

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNewsSentiment();
        setNews(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
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

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Latest News & Sentiments</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((article, index) => (
            <div key={index} className="news-card p-5 border rounded shadow hover:bg-gray-100 cursor-pointer" onClick={() => openModal(article)}>
              <h2 className="text-xl font-semibold">{truncateText(article.title, 50)}</h2>
              <p className="text-gray-700">{truncateText(article.summary, 100)}</p>
              <p className="text-gray-600">Sentiment: {article.overall_sentiment_label}</p>
            </div>
          ))}
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
          <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
          <img src={selectedArticle.banner_image} alt={selectedArticle.title} className="w-full h-auto mb-4" />
          <div className="max-h-96 overflow-y-auto">
            <p className="mb-2">{selectedArticle.summary}</p>
            <p className="text-gray-600">Published at: {selectedArticle.time_published}</p>
            <p className="text-gray-600">Sentiment: {selectedArticle.overall_sentiment_label}</p>
            <p className="text-gray-600">Sentiment Score: {selectedArticle.overall_sentiment_score}</p>
            <p className="text-gray-600">Authors: {selectedArticle.authors.join(', ')}</p>
            <p className="text-gray-600">Source: {selectedArticle.source}</p>
            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Read more</a>
          </div>
          <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
        </Modal>
      )}
    </div>
  );
};

export default News;
