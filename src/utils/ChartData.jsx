// /src/utils/chartData.jsx

export const getChartData = (historicalPrices, ticker) => {
    if (!historicalPrices) return null;
  
    const formatLabel = (dateString) => {
      const date = new Date(dateString);
      const period = historicalPrices.period;
  
      if (period === '1d') {
        return date.toLocaleString('en-GB', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } else if (period === '5d') {
        return date.toLocaleDateString('en-GB', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          hour12: false,
        });
      } else if (period === '1mo') {
        return date.toLocaleDateString('en-GB', {
          timeZone: 'America/New_York',
          day: '2-digit',
          month: 'short',
          hour12: false,
        });
      } else if (period === '1y') {
        return date.toLocaleDateString('en-GB', {
          timeZone: 'America/New_York',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      } else {
        return date.toLocaleDateString('en-GB', {
          timeZone: 'America/New_York',
          month: 'short',
          year: 'numeric',
        });
      }
    };
  
    const labels = historicalPrices.data.map((price) => {
      if (price.Date) {
        return formatLabel(price.Date);
      } else if (price.Datetime) {
        return formatLabel(price.Datetime);
      }
      return '';
    });
  
    const closeData = historicalPrices.data.map((price) => price.Close);
    const volumeData = historicalPrices.data.map((price) => price.Volume);
  
    return {
      labels,
      datasets: [
        {
          label: `${ticker.toUpperCase()} Close Prices`,
          data: closeData,
          fill: false,
          borderColor: 'rgba(153,102,255,1)',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: `${ticker.toUpperCase()} Volume`,
          data: volumeData,
          fill: false,
          borderColor: 'rgba(255,206,86,1)',
          tension: 0.1,
          yAxisID: 'y1',
        },
      ],
      period: historicalPrices.period,
    };
  };  

  export default getChartData;
  