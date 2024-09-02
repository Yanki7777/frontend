import React from 'react';
import { Box, Paper, Typography, Divider, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShowChartIcon from '@mui/icons-material/ShowChart';


const recommendationColors = {
  'STRONG_BUY': '#00ff00',  // Vivid green
  'BUY': '#008000',         // Green
  'NEUTRAL': '#808080',     // Gray
  'SELL': '#ff69b4',        // Pink
  'STRONG_SELL': '#ff0000'  // Vivid red
};

const AnalysisSection = ({ title, data, icon: Icon }) => {
  const recommendationColor = recommendationColors[data.RECOMMENDATION] || '#000'; // Default to black if undefined

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Icon sx={{ mr: 1, color: recommendationColor }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: recommendationColor }}>
          {title}: {data.RECOMMENDATION}
        </Typography>
      </Box>
      <Box sx={{ pl: 4 }}>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          <span style={{ color: recommendationColors['BUY'] }}>Buy: {JSON.stringify(data.BUY, null, 2)}</span><br />
          <span style={{ color: recommendationColors['NEUTRAL'] }}>Neutral: {JSON.stringify(data.NEUTRAL, null, 2)}</span><br />
          <span style={{ color: recommendationColors['SELL'] }}>Sell: {JSON.stringify(data.SELL, null, 2)}</span><br />
        </Typography>
      </Box>
    </Box>
  );
};


const AnalysisSummary = ({ techAnalysisResult, tickerInterval, loading }) => {
  if (loading) {
    return (
      <Paper
        elevation={4}
        sx={{ padding: 3, borderRadius: 2 }}
      >
        <Box>
          <CircularProgress />

        </Box>
      </Paper>
    );
  }

  if (!techAnalysisResult) {
    return (
      <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
        No analysis available.<br /> Analyze ticker to get analysis
      </Typography>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };


  return (
    <Paper
      elevation={4}
      sx={{ padding: 1, borderRadius: 2, position: 'relative', overflow: 'hidden', height: '94%'}}
    >
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          {techAnalysisResult.ticker?.toUpperCase()}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          {techAnalysisResult.interval}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          {formatDate(techAnalysisResult.timestamp)} <strong>{tickerInterval}</strong>
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <pre>
          RSI {JSON.stringify(techAnalysisResult.indicators.RSI, null, 2)} <br />
          MACD.macd {JSON.stringify(techAnalysisResult.indicators['MACD.macd'], null, 2)} <br />
          MACD.signal {JSON.stringify(techAnalysisResult.indicators['MACD.signal'], null, 2)} <br />
          BB.lower {JSON.stringify(techAnalysisResult.indicators['BB.lower'], null, 2)} <br />
          BB.upper {JSON.stringify(techAnalysisResult.indicators['BB.upper'], null, 2)} <br />
          BBPower {JSON.stringify(techAnalysisResult.indicators['BBPower'], null, 2)}
        </pre>
        <Divider sx={{ mb: 2 }} />

        {techAnalysisResult.summary && (
          <AnalysisSection title="Indicators" data={techAnalysisResult.summary} icon={TrendingUpIcon} />
        )}
        {techAnalysisResult.moving_averages && (
          <AnalysisSection title="Moving Averages" data={techAnalysisResult.moving_averages} icon={EqualizerIcon} />
        )}
        {techAnalysisResult.oscillators && (
          <AnalysisSection title="Oscillators" data={techAnalysisResult.oscillators} icon={ShowChartIcon} />
        )}
      </Box>
    </Paper>
  );

};

export default AnalysisSummary;