import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PopulationGraph = ({ populationData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (populationData && populationData.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const chartPopulation = chartRef.current.getContext('2d');

            // Process the population data
            const cities = populationData.map(city => city.city);
            const populations = populationData.map(city => {
                // Get the most recent population value
                const populationValues = city.populationCounts;
                return populationValues[populationValues.length - 1].value;
            });

            // Colors array, using TailwindCSS colours
            const colors = [
                '#ef4444', // red-500
                '#fb923c', // orange-400
                '#facc15', // yellow-400
                '#a3e635', // lime-400
                '#4ade80', // green-400
                '#10b981', // emerald-500
                '#2dd4bf', // teal-400
                '#38bdf8', // sky-400
                '#2563eb', // blue-600
                '#8b5cf6', // violet-500
                '#9333ea', // purple-600
                '#e879f9', // fuscia-400
                '#ec4899', // pink-500
                '#fda4af', // rose-300
            ];

            // Create new chart
            chartInstance.current = new Chart(chartPopulation, {
                type: 'bar',
                data: {
                    labels: cities,
                    datasets: [{
                        label: 'Population',
                        data: populations,
                        backgroundColor: cities.map((_, index) => 
                            colors[index % colors.length]
                        ),
                        borderColor: cities.map((_, index) => 
                            colors[index % colors.length]
                        ),
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'City Populations',
                            color: 'white',
                            font: {
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                color: 'white',
                                font: {
                                    size: 14
                                }
                            }
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white',
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [populationData]);

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 p-4">
            <canvas ref={chartRef} />
        </div>
    );
};

export default PopulationGraph;