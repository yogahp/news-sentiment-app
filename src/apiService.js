import axios from 'axios';

const API_KEY = 'RIBXT3XYLI69PC0Q';
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchNewsSentiment = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: 'AAPL', // Example ticker
        apikey: API_KEY,
        limit: 10, // Limit to 10 articles for simplicity
      },
    });
    return response.data.feed;
  } catch (error) {
    console.error('Error fetching news sentiment data', error);
    throw error;
  }
};