import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const Balance = () => {
    const series = [75, 90, 60]; // Balance, Income, Expense

    const options = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                hollow: {
                    margin: 5,
                    size: '10%',
                },
                track: {
                    show: true,
                    background: '#333',
                    strokeWidth: '500%',
                },
                dataLabels: {
                    name: {
                        show: false,  // Hide name label
                    },
                    value: {
                        show: false, // Hide value label
                    },
                    total: {
                        show: false  // Hide total in the center
                    }
                }
            }
        },
        tooltip: {
            enabled: true,
            theme: 'dark', // Optional: 'light' or 'dark'
            style: {
                fontSize: '14px'
            }
        },
        labels: ['Balance', 'Income', 'Expense'],
        colors: ['#00FF7F', '#1E90FF', '#FF6347'],
        legend: {
            show: true,
            position: 'right',
            labels: {
                colors: '#fff',
                useSeriesColors: false
            },
            fontSize: '20px',
            offsetX: -160,
            itemMargin: {
                horizontal: 5,
                vertical: 5
            }
        }
    };


    const lineOptions = {
        chart: {
            type: 'line'
        },
        xaxis: {
            categories: ['Balance', 'Income', 'Expense'],

            labels: {
                style: {
                    colors: '#FFBF00', // 👈 white text for x-axis labels
                    fontSize: '13px'
                }
            }

        },
        yaxis: {

            labels: {
                style: {
                    colors: '#ffffff', // 👈 white text for x-axis labels
                    fontSize: '13px'
                }
            }

        },
        tooltip: {
            theme: 'dark'
        },
        colors: ['#00FF7F']
    };


    const [radOrLine, setRadOrLine] = useState('R')

    const handleRadial = () => setRadOrLine('R');
    const handleLine = () => setRadOrLine('L');
    return (
        <div className="flex flex-col p-4 w-full max-w-[480px] h-62 max-h-[450] border border-none rounded-lg bg-gradient-to-r from-black via-gray-800 to-green-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
                <p className='text-white text-xl'>Categories</p>
                <div className="flex text-white items-center">
                    <p className='hover:bg-green-800 p-1 rounded-lg cursor-pointer' onClick={handleRadial}>Pie Chart</p>
                    <p className='px-3'>|</p>
                    <p className='hover:bg-green-800 p-1 rounded-lg cursor-pointer' onClick={handleLine}>Line Chart</p>
                </div>
            </div>

            <div className="flex">
                {radOrLine === 'R' && (
                    <Chart options={options} series={series} type="radialBar" height={250} />
                )}
                {radOrLine === 'L' && (
                    <Chart options={lineOptions} series={[{ name: 'Amount', data: series }]} type="line" height={140} width={450} />
                )}
            </div>
        </div>
    );
};

export default Balance;
