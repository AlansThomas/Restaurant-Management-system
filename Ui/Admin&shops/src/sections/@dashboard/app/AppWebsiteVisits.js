import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect, useRef } from "react";
import { Card, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// OverlayBarChart component
function OverlayBarChart({ options, series, onClose }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
      />
      <IconButton
        style={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

OverlayBarChart.propTypes = {
  options: PropTypes.object.isRequired,
  series: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

// AppWebsiteVisits component
AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppWebsiteVisits({ ...other }) {
  const [count, setCount] = useState(0);
  const [AdminCount, setAdminCount] = useState(0);
  const [ActiveCustomers, setActiveCustomers] = useState(0);

  const [showSecondBarGraph, setShowSecondBarGraph] = useState(false);
  const [secondGraphData, setSecondGraphData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/counts")
      .then((res) => res.json())
      .then((data) => {
        setCount(data.totalusers);
        setAdminCount(data.Admincount);
        setActiveCustomers(data.Onlycustomers);
      });
  }, []);

  const barChartRef = useRef(null);

  const barChartData = {
    options: {
      chart: {
        id: 'bar-chart',
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (config && config.dataPointIndex !== undefined) {
              const categoryIndex = config.dataPointIndex;
              const secondGraphData = secondBarChartData.series[0].data;
              const updatedSeries = [...barChartData.series];
              updatedSeries[0].data = updatedSeries[0].data.map((value, index) => {
                return index === categoryIndex ? secondGraphData[index] : value;
              });
              setSecondGraphData(secondGraphData);
              setShowSecondBarGraph(true);
              barChartRef.current.updateSeries(updatedSeries);
            }
          }
        }
      },
      xaxis: {
        categories: ['Total users', 'Admin Count', 'Active Customers']
      },
      plotOptions: {
        bar: {
          distributed: false,
        }
      },
      
      
    },
    series: [{
      name: 'Total Users',
      data: [count, AdminCount, ActiveCustomers]
    }]
  };

  const secondBarChartData = {
    options: {
      chart: {
        id: 'second-bar-chart'
      },
      xaxis: {
        categories: ['Category A', 'Category B', 'Category C','Category A', 'Category B', 'Category C']
      },
      plotOptions: {
        bar: {
          distributed: true,
        }
      },
      exporting: false
    },
    series: [{
      name: 'Demo Values',
      data: [70, 50, 80,33,13,77] // New values for the second bar graph
    }]
  };

  const handleCloseSecondGraph = () => {
    setShowSecondBarGraph(false);
    barChartRef.current.updateSeries([{ data: [count, AdminCount, ActiveCustomers] }]);
  };

  return (
    <Card {...other}>
      <h3 style={{ marginLeft: '2rem' }}>Bar Graph</h3>
      <ReactApexChart
        style={{ marginTop: '2rem', position: 'relative' }}
        options={barChartData.options}
        series={barChartData.series}
        type="bar"
        ref={barChartRef}
      />
      {showSecondBarGraph && (
        <OverlayBarChart
          options={secondBarChartData.options}
          series={secondBarChartData.series}
          onClose={handleCloseSecondGraph}
        />
      )}
    </Card>
  );
}
