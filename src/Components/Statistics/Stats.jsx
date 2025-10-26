import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const Stats = () => {
    const [chartData] = useState({
        series: [
            {
                name: 'Income',
                data: [4000, 3000, 5000, 2000, 1000, 4000, 6000]
            },
            {
                name: 'Expense',
                data: [2000, 1000, 3000, 1500, 700, 2200, 3300]
            },
            {
                name: 'Balance',
                data: [1000, 500, 2000, 1000, 700, 2200, 3300]
            }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 150,
                background: 'transparent'
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                labels: {
                    style: {
                        colors: '#FFBF00', // 👈 white text for x-axis labels
                        fontSize: '13px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: '₹ (in rupees)',
                    style: {
                        color: '#ffffff' // 👈 white y-axis title
                    }
                },
                labels: {
                    style: {
                        colors: '#ffffff', // 👈 white text for y-axis labels
                        fontSize: '14px'
                    }
                }
            },
            fill: {
                opacity: 0.6
            },
            tooltip: {
                y: {
                    formatter: (val) => `₹ ${val}`
                }
            },
            legend: {
                show: true, // ensure legend is visible
                labels: {
                    colors: '#ffffff', // 👈 white text for "Income" and "Expense"
                    useSeriesColors: false // this makes sure it doesn't override with series colors
                },
                position: 'top', // or 'bottom', 'right' etc.
                fontSize: '14px'
            },
            colors: ['#22c55e', '#ef4444', '#FFBF00' ] // green for income, red for expense
        }
    });

    return (
        <div className="flex flex-col w-full max-w-[550px] h-full max-h-[350px] border border-none rounded-lg bg-gradient-to-r from-black via-gray-800 to-green-800 shadow-2xl shadow-green-900">
            <div className="flex items-center justify-between p-3">
                <p className="text-white text-xl">Stats</p>
                <div className="flex text-white items-center">
                    <p className="hover:bg-green-800 px-2 py-1 rounded-lg cursor-pointer">Expense</p>
                    <p className="px-3">|</p>
                    <p className="hover:bg-green-800 px-2 py-1 rounded-lg cursor-pointer">Income</p>
                </div>
            </div>
            <div className="p-4  transparent  rounded-b-lg">
                <Chart options={chartData.options} series={chartData.series} type="bar" height={250} />
            </div>
        </div>
    );
};

export default Stats;
