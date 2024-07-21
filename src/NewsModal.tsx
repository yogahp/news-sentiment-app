import React from 'react';
import Modal from 'react-modal';
import { Article } from './apiService';
import { FaRegCalendarAlt, FaRegSmile, FaUser, FaExternalLinkAlt } from 'react-icons/fa';

interface NewsModalProps {
  article: Article | null;
  onRequestClose: () => void;
}

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

const NewsModal: React.FC<NewsModalProps> = ({ article, onRequestClose }) => {
  if (!article) return null;

  return (
    <Modal
      isOpen={!!article}
      onRequestClose={onRequestClose}
      contentLabel="Article Details"
      className="relative bg-white p-5 rounded shadow-lg max-w-2xl mx-auto overflow-y-auto max-h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-t">
          {article.title}
        </h2>
        <img src={article.banner_image} alt={article.title} className="w-full h-auto mb-4 rounded" />
        <div className="px-4 space-y-4">
          <p className="text-gray-800">{article.summary}</p>
          <div className="text-gray-600 flex items-center">
            <FaRegCalendarAlt className="mr-2" /> Published at: {article.time_published}
          </div>
          <div className={`text-gray-600 flex items-center ${getSentimentColor(article.overall_sentiment_label)}`}>
            <FaRegSmile className="mr-2" /> Sentiment: {article.overall_sentiment_label}
          </div>
          <div className="text-gray-600 flex items-center">
            <FaRegSmile className="mr-2" /> Sentiment Score: {article.overall_sentiment_score}
          </div>
          <div className="text-gray-600 flex items-center">
            <FaUser className="mr-2" /> Authors: {article.authors.join(', ')}
          </div>
          <div className="text-gray-600 flex items-center">
            <FaExternalLinkAlt className="mr-2" /> Source: {article.source}
          </div>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Read more
          </a>
        </div>
        <button
          onClick={onRequestClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default React.memo(NewsModal);
