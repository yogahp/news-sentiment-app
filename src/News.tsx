import React, { useState, useEffect, useCallback } from 'react';
import { fetchNewsSentiment, Article } from './apiService';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';

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

  const loadMoreNews = useCallback(() => {
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
  }, [allNews, page]);

  const openModal = useCallback((article: Article) => {
    setSelectedArticle(article);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedArticle(null);
  }, []);

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
              <NewsCard key={index} article={article} onClick={() => openModal(article)} />
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
      <NewsModal article={selectedArticle} onRequestClose={closeModal} />
    </div>
  );
};

export default News;
