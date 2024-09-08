import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RecommendationCounts = ({ portfolio }) => {

  const getRecommendationCounts = () => {
    const counts = {
      ind: { 'STRONG_BUY': 0, 'BUY': 0, 'NEUTRAL': 0, 'SELL': 0, 'STRONG_SELL': 0 },
      ma: { 'STRONG_BUY': 0, 'BUY': 0, 'NEUTRAL': 0, 'SELL': 0, 'STRONG_SELL': 0 },
      osc: { 'STRONG_BUY': 0, 'BUY': 0, 'NEUTRAL': 0, 'SELL': 0, 'STRONG_SELL': 0 },
      analyst: { 'STRONG_BUY': 0, 'BUY': 0, 'NEUTRAL': 0, 'SELL': 0, 'STRONG_SELL': 0 },
    };

    portfolio?.trades?.forEach((trade) => {
      const indRecommendation = trade.tv_ind1_recommendation?.trim() || '';
      const maRecommendation = trade.tv_ma1_recommendation?.trim() || '';
      const oscRecommendation = trade.tv_osc1_recommendation?.trim() || '';
      const analystRecommendation = trade.analyst_recommendation?.trim() || '';

      if (counts.ind.hasOwnProperty(indRecommendation)) {
        counts.ind[indRecommendation] += 1;
      }
      if (counts.ma.hasOwnProperty(maRecommendation)) {
        counts.ma[maRecommendation] += 1;
      }
      if (counts.osc.hasOwnProperty(oscRecommendation)) {
        counts.osc[oscRecommendation] += 1;
      }
      if (counts.analyst.hasOwnProperty(analystRecommendation)) {
        counts.analyst[analystRecommendation] += 1;
      }
    });

    return counts;
  };

  const recommendationCounts = useMemo(() => getRecommendationCounts(), [portfolio]);

  const recommendationData = useMemo(() => ({
    labels: ['ind', 'ma', 'osc', 'analyst'],
    datasets: [
      {
        label: 'STRONG_BUY',
        data: [
          recommendationCounts.ind['STRONG_BUY'],
          recommendationCounts.ma['STRONG_BUY'],
          recommendationCounts.osc['STRONG_BUY'],
          recommendationCounts.analyst['STRONG_BUY'],
        ],
        backgroundColor: 'rgba(0, 0, 139, 0.6)', // Very dark blue
      },
      {
        label: 'BUY',
        data: [
          recommendationCounts.ind['BUY'],
          recommendationCounts.ma['BUY'],
          recommendationCounts.osc['BUY'],
          recommendationCounts.analyst['BUY'],
        ],
        backgroundColor: 'rgba(173, 216, 230, 0.6)', // Light blue
      },
      {
        label: 'NEUTRAL',
        data: [
          recommendationCounts.ind['NEUTRAL'],
          recommendationCounts.ma['NEUTRAL'],
          recommendationCounts.osc['NEUTRAL'],
          recommendationCounts.analyst['NEUTRAL'],
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'SELL',
        data: [
          recommendationCounts.ind['SELL'],
          recommendationCounts.ma['SELL'],
          recommendationCounts.osc['SELL'],
          recommendationCounts.analyst['SELL'],
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'STRONG_SELL',
        data: [
          recommendationCounts.ind['STRONG_SELL'],
          recommendationCounts.ma['STRONG_SELL'],
          recommendationCounts.osc['STRONG_SELL'],
          recommendationCounts.analyst['STRONG_SELL'],
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  }), [recommendationCounts]);

  const chartOptions = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          font: {
            size: 18, // Increase the font size of the legend
          },
        },
      },
      title: {
        display: true,
        text: 'Portfolio Recommendations',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number(value).toFixed(0);
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 18, // Increase the font size of the y-axis labels
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  }), []);

  return (
    portfolio?.trades?.length > 0 && (
      <div style={{ height: '300px' }}>
        <Bar data={recommendationData} options={chartOptions} />
      </div>
    )
  );
};

export default RecommendationCounts;