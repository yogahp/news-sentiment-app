import axios from 'axios';

export interface Article {
  title: string;
  summary: string;
  banner_image: string;
  time_published: string;
  overall_sentiment_label: string;
  overall_sentiment_score: number;
  authors: string[];
  source: string;
  url: string;
}

// const API_KEY = 'RIBXT3XYLI69PC0Q';
// const BASE_URL = 'https://www.alphavantage.co/query';

// export const fetchNewsSentiment = async (): Promise<Article[]> => {
//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         function: 'NEWS_SENTIMENT',
//         tickers: 'AAPL', // Example ticker
//         apikey: API_KEY,
//         limit: 10, // Limit to 10 articles for simplicity
//       },
//     });
//     return response.data.feed;
//   } catch (error) {
//     console.error('Error fetching news sentiment data', error);
//     throw error;
//   }
// };

export const fetchNewsSentiment = async (): Promise<Article[]> => {
  try {
    const response = await fetch('/sample_response.json'); // Fetching the local JSON file
    const data = await response.json();
    return data.feed; // Adjust this if the JSON structure is different
  } catch (error) {
    console.error('Error fetching news sentiment data', error);
    throw error;
  }
};
