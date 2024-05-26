import React from 'react';
import ReactApexChart from 'react-apexcharts';

const MonthlyIncomeChart = (bookings) => {
  // Filter bookings yang status === "Selesai"
  const filteredBookings = bookings.bookings.filter(
    (booking) => booking.status === 'Selesai'
  );

  // Inisialisasi array dengan panjang 12, diisi dengan nilai 0
  const incomeByMonth = new Array(12).fill(0);

  // Mengelompokkan bookings berdasarkan bulan dan menjumlahkan totalPrice
  filteredBookings.forEach((booking) => {
    const month = new Date(booking.updatedAt).getMonth(); // Januari = 0, Desember = 11
    incomeByMonth[month] += booking.totalPrice;
  });

  // Mengubah object menjadi array data untuk chart
  const dataForChart = Object.values(incomeByMonth).map((value) =>
    (value / 1000000).toFixed(2)
  );

  const options = {
    chart: {
      id: 'Pendapatan perbulan',
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val} Juta`;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#36292C'],
      },
    },
    stroke: {
      curve: 'smooth',
    },

    title: {
      text: 'Pendapatan Bulanan',
      align: 'center',
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ],
    },
    yaxis: {
      title: {
        text: 'Pendapatan (Juta)',
      },
      labels: {
        show: false,
        formatter: function (val) {
          return `${val} Juta`;
        },
      },
    },
  };

  const series = [
    {
      name: 'pendapatan',
      data: dataForChart,
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height="350"
      />
    </div>
  );
};

export default MonthlyIncomeChart;
