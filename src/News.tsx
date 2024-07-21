import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchNewsSentiment, Article } from './apiService';
import { FaRegCalendarAlt, FaRegSmile, FaUser, FaExternalLinkAlt } from 'react-icons/fa';

Modal.setAppElement('#root');

const News: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchInitialNews();
  }, []);

  const fetchInitialNews = async () => {
    try {
      const data = await fetchNewsSentiment();
      setAllNews(data); // Store all data
      const initialNews = data.slice(0, 9); // Get first 9 items
      setNews(initialNews);
      setLoading(false);
      setPage(2);
    } catch (error) {
      console.error('Error fetching news sentiment data:', error);
      setLoading(false);
    }
  };

  const loadMoreNews = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const startIndex = (page - 1) * 9;
      const endIndex = startIndex + 9;
      const moreNews = allNews.slice(startIndex, endIndex);

      if (moreNews.length > 0) {
        setNews((prevNews) => [...prevNews, ...moreNews]);
        setPage((prevPage) => prevPage + 1);
      }
      setLoadingMore(false);
    }, 1500); // Simulate loading time of 1.5 seconds
  };

  const openModal = (article: Article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getSentimentColor = (sentiment: string) => {
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
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((article, index) => (
              <div
                key={index}
                className="news-card p-5 border rounded shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
                onClick={() => openModal(article)}
              >
                <h2 className="text-xl font-semibold mb-2">{truncateText(article.title, 50)}</h2>
                <p className="text-gray-700 mb-4">{truncateText(article.summary, 100)}</p>
                <p className={`font-medium ${getSentimentColor(article.overall_sentiment_label)}`}>
                  Sentiment: {article.overall_sentiment_label}
                </p>
              </div>
            ))}
          </div>
          {news.length < allNews.length && (
            <div className="flex justify-center mt-5">
              {loadingMore ? (
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              ) : (
                <button
                  onClick={loadMoreNews}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Load More
                </button>
              )}
            </div>
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
            <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-t">
              {selectedArticle.title}
            </h2>
            <img src={selectedArticle.banner_image} alt={selectedArticle.title} className="w-full h-auto mb-4 rounded" />
            <div className="px-4 space-y-4">
              <p className="text-gray-800">{selectedArticle.summary}</p>
              <div className="text-gray-600 flex items-center">
                <FaRegCalendarAlt className="mr-2" /> Published at: {selectedArticle.time_published}
              </div>
              <div className={`text-gray-600 flex items-center ${getSentimentColor(selectedArticle.overall_sentiment_label)}`}>
                <FaRegSmile className="mr-2" /> Sentiment: {selectedArticle.overall_sentiment_label}
              </div>
              <div className="text-gray-600 flex items-center">
                <FaRegSmile className="mr-2" /> Sentiment Score: {selectedArticle.overall_sentiment_score}
              </div>
              <div className="text-gray-600 flex items-center">
                <FaUser className="mr-2" /> Authors: {selectedArticle.authors.join(', ')}
              </div>
              <div className="text-gray-600 flex items-center">
                <FaExternalLinkAlt className="mr-2" /> Source: {selectedArticle.source}
              </div>
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Read more
              </a>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default News;
