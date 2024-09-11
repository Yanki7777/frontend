import React, { useState, useCallback } from 'react';
import { Box, Paper, Button, Typography, FormControl, FormLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Radio, RadioGroup, FormControlLabel, TextField, Alert } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';
import RecommendationCounts from './RecommendationCounts';

const intervals = ["1m", "5m", "15m", "30m", "1h", "1d", "1W", "1M"];
const sectorOptions = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical', 'Consumer Defensive', 'Industrials', 'Utilities', 'Basic Materials', 'Real Estate', 'Communication Services', 'Energy'];
const marketCapOptions = ['Micro', 'Small', 'Mid', 'Big', 'Mega'];

const CheckboxGroup = ({
  renderList, title, prefix, requiredRecommendations, onChangeHandler,
  rsiValue, onRsiChange, rsiLabel, macdCrossover, onMacdCrossoverChange, macdHistShift, onMacdHistShiftChange
}) => (
  <Box sx={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
        {renderList.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                size="small"
                name={`${prefix}${item}`}
                checked={requiredRecommendations[`${prefix}${item}`]}
                onChange={onChangeHandler}
              />
            }
            label={item.charAt(0).toUpperCase() + item.slice(1)}
            sx={{ marginRight: 0, marginLeft: 0, gap: '0px' }}
          />
        ))}
      </Box>
      <strong>{title}: </strong>
    </Box>

    {/* MACD Crossover field */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <Checkbox
        checked={macdCrossover}
        onChange={onMacdCrossoverChange}
        size="small"
      />
      <FormLabel component="legend" sx={{ marginRight: 1 }}><strong>MACD Crossover</strong></FormLabel>
    </Box>

    {/* MACD Hist field */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <Checkbox
        checked={macdHistShift}
        onChange={onMacdHistShiftChange}
        size="small"
      />
      <FormLabel component="legend" sx={{ marginRight: 1 }}><strong>MACD Hist</strong></FormLabel>
    </Box>

    {/* RSI field */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormLabel component="legend" sx={{ marginRight: 0 }}><strong>{rsiLabel}</strong></FormLabel>
      <TextField
        type="number"
        value={rsiValue}
        onChange={onRsiChange}
        variant="outlined"
        size="small"
        inputProps={{ min: 0, max: 100 }}    
        sx={{ width: '90px' }} 
      />
    </Box>
  </Box>
);


const BuildPortfolio = ({ portfolioInterval1, portfolioInterval2, setPortfolioInterval1, setPortfolioInterval2, setPortfolio, portfolio, portfolioLoading, setPortfolioLoading, selectedUniverse }) => {

  const [requiredRecommendations, setRequiredRecommendations] = useState({
    ind1: true,
    ma1: false,
    osc1: false,
    ind2: true,
    ma2: false,
    osc2: false,
    analyst: false,
  });

  const [selectedSectors, setSelectedSectors] = useState(sectorOptions);
  const [selectedMarketCaps, setSelectedMarketCaps] = useState(marketCapOptions);
  const [rsi1Below, setRsi1Below] = useState(100);
  const [rsi2Below, setRsi2Below] = useState(100);
  const [macdCrossover1, setMacdCrossover1] = useState(false);
  const [macdCrossover2, setMacdCrossover2] = useState(false);
  const [macdHistShift1, setMacdHistShift1] = useState(false);
  const [macdHistShift2, setMacdHistShift2] = useState(false);

  const [error, setError] = useState(null); // Error state

  const handleInputChange = useCallback((setter) => (event) => {
    setter(event.target.value);
  }, []);

  const handleCheckboxChange = useCallback((setter) => (event) => {
    setter(event.target.checked); // Since it's a boolean
  }, []);
  

  const handleBuildPortfolio = async () => {
    setPortfolioLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${baseUrl}/build_portfolio`, {
        selectedUniverse,
        portfolioInterval1,
        portfolioInterval2,
        requiredRecommendations,
        selectedSectors,
        selectedMarketCaps,
        rsi1Below,
        rsi2Below,
        macdCrossover1,
        macdCrossover2,
        macdHistShift1,
        macdHistShift2
      });
      if (response.status === 200) {
        const portfolio = response.data;
        setPortfolio(portfolio);
        if (portfolio.length === 0) {
          setError('No Portfolio at this time.');
        }
      } else {
        setError('Unexpected response status: ' + response.status);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to retrieve portfolio. Please try again later.');
      setPortfolio(null);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleIntervalChange1 = useCallback((event) => {
    setPortfolioInterval1(event.target.value);
  }, [setPortfolioInterval1]);

  const handleIntervalChange2 = useCallback((event) => {
    setPortfolioInterval2(event.target.value);
  }, [setPortfolioInterval2]);

  const handleRequirementsChange = useCallback((event) => {
    const { name, checked } = event.target;
    setRequiredRecommendations((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const handleSectorChange = (event) => {
    const { target: { value } } = event;
    setSelectedSectors(typeof value === 'string' ? value.split(',') : value);
  };

  const handleMarketCapChange = (event) => {
    const { target: { value } } = event;
    setSelectedMarketCaps(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Paper elevation={3} sx={{ padding: 1, height: 'auto', minHeight: '650px' }}>
      <Box sx={{ marginBottom: 1 }}>
        <Box display="flex" justifyContent="center" sx={{ marginBottom: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBuildPortfolio}
            disabled={!selectedUniverse || portfolioLoading}
            sx={{ flex: 1, height: 30 }}
          >
            {portfolioLoading ? "Building..." : "Build Portfolio"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {error}
          </Alert>
        )}

        {/* TA Interval 1 Section */}
        <Box sx={{ marginBottom: 0 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Interval 1</FormLabel>
            <RadioGroup
              aria-label="portfolio-interval"
              name="portfolioInterval1"
              value={portfolioInterval1}
              onChange={handleIntervalChange1}
              sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px' }}
            >
              {intervals.map((interval) => (
                <FormControlLabel
                  key={interval}
                  value={interval}
                  control={<Radio size="small" />}
                  label={interval}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* TA Interval 1 Recommendations */}
        <CheckboxGroup
          renderList={['ind1', 'ma1', 'osc1']}
          title="TV Recommendations"
          prefix=""
          requiredRecommendations={requiredRecommendations}
          onChangeHandler={handleRequirementsChange}
          rsiValue={rsi1Below}
          onRsiChange={handleInputChange(setRsi1Below)}
          rsiLabel="RSI 1 below"
          macdCrossover={macdCrossover1}
          onMacdCrossoverChange={handleCheckboxChange(setMacdCrossover1)} // Updated
          macdHistShift={macdHistShift1}
          onMacdHistShiftChange={handleCheckboxChange(setMacdHistShift1)} // Updated
        />

        {/* TA Interval 2 Section */}
        <Box sx={{ marginBottom: 0 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Interval 2</FormLabel>
            <RadioGroup
              aria-label="portfolio-interval"
              name="portfolioInterval2"
              value={portfolioInterval2}
              onChange={handleIntervalChange2}
              sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px' }}
            >
              {intervals.map((interval) => (
                <FormControlLabel
                  key={interval}
                  value={interval}
                  control={<Radio size="small" />}
                  label={interval}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* TA Interval 2 Recommendations */}
        <CheckboxGroup
          renderList={['ind2', 'ma2', 'osc2']}
          title="TV Recommendations"
          prefix=""
          requiredRecommendations={requiredRecommendations}
          onChangeHandler={handleRequirementsChange}
          rsiValue={rsi2Below}
          onRsiChange={handleInputChange(setRsi2Below)}
          rsiLabel="RSI 2 below"
          macdCrossover={macdCrossover2}
          onMacdCrossoverChange={handleCheckboxChange(setMacdCrossover2)} // Updated
          macdHistShift={macdHistShift2}
          onMacdHistShiftChange={handleCheckboxChange(setMacdHistShift2)} // Updated
        />

        {/* Analyst and Other Inputs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="analyst"
                checked={requiredRecommendations.analyst}
                onChange={handleRequirementsChange}
              />
            }
            label="Analyst"
          />

          <FormControl fullWidth size="small">
            <FormLabel component="legend">Market Cap</FormLabel>
            <Select
              multiple
              value={selectedMarketCaps}
              onChange={handleMarketCapChange}
              input={<OutlinedInput label="Market Cap" />}
              renderValue={(selected) => selected.join(', ')}
              sx={{ padding: 0 }}
            >
              {marketCapOptions.map((marketCap) => (
                <MenuItem key={marketCap} value={marketCap} sx={{ padding: 0 }}>
                  <Checkbox checked={selectedMarketCaps.indexOf(marketCap) > -1} size="small" />
                  <ListItemText primary={marketCap} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <FormLabel component="legend">Sector</FormLabel>
            <Select
              multiple
              value={selectedSectors}
              onChange={handleSectorChange}
              input={<OutlinedInput label="Sector" />}
              renderValue={(selected) => selected.join(', ')}
              sx={{ padding: 0 }}
            >
              {sectorOptions.map((sector) => (
                <MenuItem key={sector} value={sector} sx={{ padding: 0 }}>
                  <Checkbox checked={selectedSectors.indexOf(sector) > -1} size="small" />
                  <ListItemText primary={sector} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      </Box>

      <RecommendationCounts portfolio={portfolio} />

    </Paper>
  );
};

export default BuildPortfolio;
