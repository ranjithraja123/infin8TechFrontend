import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const Goal = () => {
    const [chartData] = useState({
        series: [67], // goal percentage (e.g., 67%)
        options: {
            chart: {
                type: 'radialBar',
                height: 300,
                background: 'transparent'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 15,
                        size: '60%',
                        background: 'transparent',
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.2
                        }
                    },
                    track: {
                        background: '#333',
                        strokeWidth: '100%',
                        margin: 0,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.15
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: '#fff',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val) {
                                return `${val}%`;
                            },
                            color: '#FFBF00',
                            fontSize: '24px',
                            show: true,
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    gradientToColors: ['#22c55e'],
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Goal'],
        }
    });

    return (
        <div className="flex flex-col w-full max-w-[550px] h-full max-h-[350px] border border-none rounded-lg bg-gradient-to-r from-black via-gray-800 to-green-800 shadow-2xl shadow-green-900">
            <div className="flex items-center justify-between p-3">
                <p className="text-white text-xl">Goal Overview</p>
               
            </div>
            <div className="p-4">
                <Chart options={chartData.options} series={chartData.series} type="radialBar" height={250} />
            </div>
        </div>
    );
}

export default Goal;
