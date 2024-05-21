import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as signalR from '@microsoft/signalr';



const Grafik = () => {
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const [connection, setConnection] = useState(null);
  const [startDate, setStartDate] = useState(sixMonthsAgo);
  const [endDate, setEndDate] = useState(today);
  const [productData, setProductData] = useState([]);
  const [failureData, setFailureData] = useState([]);
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const handleSetDates = () => {
    const fetchData = async () => {
      await fetchDataTrack(startDate, endDate);
      await fetchDataError(startDate, endDate);
    };
  
    fetchData();
   
  };
  const formatData = (data) => {
    const formattedData = [];
    const weekCounts = {};

    // Menghitung jumlah PASS dan FAIL untuk setiap minggu
    data.DataTracks.$values.forEach((item) => {
      const date = new Date(item.TrackingDateCreate);
      const weekNumber = getWeekNumber(date);
      const year = date.getFullYear().toString().slice(-2); // Mengambil 2 digit terakhir dari tahun
      const weekKey = `${weekNumber}-${year}`;
      const result = item.TrackingResult;

      if (!weekCounts[weekKey]) {
        weekCounts[weekKey] = { pass: 0, fail: 0 };
      }

      if (result === 'PASS') {
        weekCounts[weekKey].pass++;
      } else {
        weekCounts[weekKey].fail++;
      }
    });

    // Mengonversi ke format yang diinginkan
    Object.keys(weekCounts).forEach((weekKey) => {
      formattedData.push({
        x: weekKey,
        y: weekCounts[weekKey].pass,
        y1: weekCounts[weekKey].fail,
      });
    });

    return formattedData;
  };

  // Fungsi untuk mendapatkan nomor minggu dalam tahun
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
    return weekNumber;
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataTrack(startDate, endDate);
      await fetchDataError(startDate, endDate);
    };
  
    fetchData();
  
   
  }, [startDate, endDate, api]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataTrack(startDate, endDate);
      await fetchDataError(startDate, endDate);
    };
  
    fetchData();
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${api}/notificationHub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {

          connection.on('ReceiveUpdateDataNotification', (message) => {
            const fetchData = async () => {
              await fetchDataTrack(startDate, endDate);
              await fetchDataError(startDate, endDate);
            };
          
            fetchData();
            // Lakukan tindakan yang diperlukan setelah menerima notifikasi
            // Misalnya, memperbarui state atau memunculkan notifikasi
          });
        })
        .catch(err => console.error('Error connecting to SignalR hub:', err));
    }
  }, [connection]);
  const productChartOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          enabled: false, // Menghilangkan label data dari dalam bar
        },
      },
    },
    colors: ['#00E396', '#FF4560'], // Warna untuk Pass Product (Hijau) dan Fail Product (Merah)
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: productData.map((data) => data.x),
    },
    yaxis: {
      title: {
        text: 'Jumlah',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
  };
  
  const failureChartOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          enabled: false, // Menghilangkan label data dari dalam bar
        },
      },
    },
    colors: ['#FF4560'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: failureData.map((data) => data.x),
    },
    yaxis: {
      title: {
        text: 'Jumlah',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
  };
  const productChartSeries = [
    {
      name: 'Pass Product',
      data: productData.map((data) => data.y),
    },
    {
      name: 'Fail Product',
      data: productData.map((data) => data.y1),
    },
  ];

  const failureChartSeries = [
    {
      name: 'Failure Data',
      data: failureData.map((data) => data.y),
    },
  ];
  const fetchDataTrack = async (start, end) => {
    try {
      const startDateString = start.toISOString().split('T')[0];
      const endDateString = end.toISOString().split('T')[0];
      const url = `${api}/api/DataTracks/Chart?Start=${startDateString}&End=${endDateString}`;
      const response = await axios.get(url);
      const formattedProductData = formatData(response.data);
      setProductData(formattedProductData);

      // Jika ada data failure, format dan set ke state failureData
      const formattedFailureData = []; // Ubah sesuai dengan format data failure
      setFailureData(formattedFailureData);
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };
  const formatFailureData = (data) => {
    const formattedData = [];
    const weekCounts = {};
  
    // Menghitung jumlah error untuk setiap minggu
    data.DataTracks.$values.forEach((item) => {
      const date = new Date(item.TrackingDateCreate);
      const weekNumber = getWeekNumber(date);
      const year = date.getFullYear().toString().slice(-2); // Mengambil 2 digit terakhir dari tahun
      const weekKey = `${weekNumber}-${year}`;
      const errorCode = item.ErrorCode;
  
      if (!weekCounts[weekKey]) {
        weekCounts[weekKey] = {};
      }
  
      if (!weekCounts[weekKey][errorCode]) {
        weekCounts[weekKey][errorCode] = 0;
      }
  
      weekCounts[weekKey][errorCode]++;
    });
  
    // Mengonversi ke format yang diinginkan
    Object.keys(weekCounts).forEach((weekKey) => {
      Object.keys(weekCounts[weekKey]).forEach((errorCode) => {
        formattedData.push({
          x: `${weekKey} - ${errorCode}`,
          y: weekCounts[weekKey][errorCode],
        });
      });
    });
  
    return formattedData;
  };
  const fetchDataError = async (start, end) => {
    try {
      const startDateString = start.toISOString().split('T')[0];
      const endDateString = end.toISOString().split('T')[0];
      const url = `${api}/api/ErrorTrack/Chart?Start=${startDateString}&End=${endDateString}`;
      const response = await axios.get(url);
      const formattedFailureData = formatFailureData(response.data);
      setFailureData(formattedFailureData);
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Product Data</h2>
          <Chart
            options={productChartOptions}
            series={productChartSeries}
            type="bar"
            height={350}
          />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Failure Data</h2>
          <Chart
            options={failureChartOptions}
            series={failureChartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Grafik;
