import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const getSentimentColor = (sentiment) => {  
  switch (sentiment.toLowerCase()) {
    case 'bearish':
      return '#8B0000'; // Dark Red (stronger)
    case 'somewhat-bearish':
      return '#FF69B4'; // Pink
    case 'neutral':
      return '#A9A9A9'; // Darker Gray
    case 'somewhat-bullish':
      return '#32CD32'; // Lime Green (brighter)
    case 'bullish':
      return '#008000'; // Bright Green (more standing out)
    default:
      return '#000000'; // Default to black if sentiment is unknown
  }
};



const NewsSentiment = ({ newsSentiment, ticker, loading }) => {
  
  if (loading) {
    return (
      <Paper
        elevation={4}
        sx={{ padding: 3, borderRadius: 2}}
      >
        <Box>
          <CircularProgress />

        </Box>
      </Paper>
    );
  }

  
  
  
  if (!newsSentiment || !newsSentiment.news) {
    return (
      <Box sx={{ marginTop: 3 }}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            <strong>News and Sentiment for {ticker.toUpperCase()}</strong>
          </Typography>
          <Typography variant="body2">
            No news data available.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Paper elevation={1} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          <strong>News and Sentiment for {ticker.toUpperCase()}</strong>
        </Typography>
        {newsSentiment.news.length > 0 ? (
          <>
            <Typography variant="h5" gutterBottom>
              Average Sentiment: {newsSentiment.avg_sentiment.toFixed(3)}
            </Typography>
            <Box>
              {newsSentiment.news.slice(0, 20).map((newsItem, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="body2" gutterBottom>

                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: getSentimentColor(newsItem.sentiment) }}
                  >
                    {new Date(newsItem.published_on).toLocaleDateString()} -{' '}
                    <strong>{newsItem.sentiment} ({newsItem.sentiment_score})</strong>
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{newsItem.title}</strong>
                  </Typography>
                  <Typography variant="body1">
                    <strong>Summary: </strong>
                    {newsItem.summary}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Source: </strong>
                    {newsItem.source}
                  </Typography>

                  <Typography variant="body2" component="a" href={newsItem.url} target="_blank" rel="noopener noreferrer" aria-label={`Read more about ${newsItem.title}`}>
                    Read more
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Typography variant="body2">
            No news available for this ticker.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

NewsSentiment.propTypes = {
  newsSentiment: PropTypes.shape({
    news: PropTypes.arrayOf(
      PropTypes.shape({
        sentiment: PropTypes.string.isRequired,
        sentiment_score: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        published_on: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
    avg_sentiment: PropTypes.number,
  }),
  ticker: PropTypes.string.isRequired,
};

export default NewsSentiment;
