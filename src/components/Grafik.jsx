import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries,
  ChartLabel, // Import ChartLabel
} from 'react-vis';

// Data dummy
const productData = [
  { x: 'Week 1', y: 100, y1: 50 },
  { x: 'Week 2', y: 120, y1: 60 },
  { x: 'Week 3', y: 90, y1: 40 },
  { x: 'Week 4', y: 60, y1: 70 },
  { x: 'Week 5', y: 110, y1: 70 },
  { x: 'Week 6', y: 70, y1: 55 },
  { x: 'Week 7', y: 90, y1: 60 },
  { x: 'Week 8', y: 75, y1: 10 },
];

const failureData = [
  { x: 'ER001', y: 20 },
  { x: 'ER002', y: 15 },
  { x: 'ER003', y: 25 },
  { x: 'ER004', y: 12 },
  { x: 'ER005', y: 45 },
  { x: 'ER006', y: 35 },
  { x: 'ER007', y: 15 },
];

const Grafik = () => {
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());

  const [startDate, setStartDate] = useState(sixMonthsAgo);
  const [endDate, setEndDate] = useState(today);
  const handleSetDates = () => {
    // Logika untuk memperbarui data grafik berdasarkan tanggal yang dipilih
  };

  return (
    <div className="container mx-auto ">
      <div className="flex items-center gap-3 mb-10 bg-green-500 text-white py-3 pl-2 rounded-2xl">
        <div className="flex items-center">
          <label className="mr-2">Start:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded-md px-2 py-1 text-black"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2">End:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded-md px-2 py-1 text-black"
          />
        </div>
        <button
          onClick={handleSetDates}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Set
        </button>
      </div>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <XYPlot
            width={600}
            height={300}
            xType="ordinal"
            stackBy="y"
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <ChartLabel
              text="Product Data" // Judul grafik untuk productData
              className="title-label mb-3"
              includeMargin={false}
              xPercent={0.5}
              yPercent={0.1}
            />
            <VerticalBarSeries data={productData} />
            <VerticalBarSeriesCanvas data={productData} barWidth={0.5} valueField="y1" />
            <LabelSeries data={productData} getLabel={(d) => `${d.y1}`} />
          </XYPlot>
        </div>
        <div className="w-1/2 pl-4">
          <XYPlot
            width={600}
            height={300}
            xType="ordinal"
            stackBy="y"
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <ChartLabel
              text="Failure Data" // Judul grafik untuk failureData
              className="title-label"
              includeMargin={false}
              xPercent={0.5}
              yPercent={0.1}
            />
            <VerticalBarSeries data={failureData} color="#d88884"/>
          </XYPlot>
        </div>
      </div>
    </div>
  );
};

export default Grafik;
