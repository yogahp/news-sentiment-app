import React from 'react';
import { Article } from './apiService';

interface NewsCardProps {
  article: Article;
  onClick: () => void;
}

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

const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => (
  <div className="news-card p-5 border rounded shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white" onClick={onClick}>
    <h2 className="text-xl font-semibold mb-2">{truncateText(article.title, 50)}</h2>
    <p className="text-gray-700 mb-4">{truncateText(article.summary, 100)}</p>
    <p className={`font-medium ${getSentimentColor(article.overall_sentiment_label)}`}>
      Sentiment: {article.overall_sentiment_label}
    </p>
  </div>
);

export default React.memo(NewsCard);
