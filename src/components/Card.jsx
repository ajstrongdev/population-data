import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PopulationGraph from './PopulationGraph';

function Card({ country }) {
    const [populationData, setPopulationData] = useState([]);

    function handleButtonClick() { // Function to get population data for the country. This has been placed in a button otherwise the program will be making requests for all countries on page load.
        console.log(`Button clicked for ${country.name}`); // Debugging
        axios.get('https://countriesnow.space/api/v0.1/countries/population/cities')
            .then((populationResponse) => {
                const countryData = populationResponse.data.data.filter(item => {
                    switch (country.name) {
                        case 'United Kingdom':
                            return item.country === 'United Kingdom of Great Britain and Northern Ireland';
                        case 'United States':
                            return item.country === 'United States of America';
                        default:
                            return item.country === country.name;
                    }
                });
                setPopulationData(countryData); 
            })
            .catch((error) => {
                console.error('Error fetching population data: ', error);
            });
    }

    return (
        <div className="bg-slate-900 text-white rounded-lg m-8 p-8 text-center hover:shadow-bxs transition-all" id={country.name.toLowerCase()}>
            {country.flag && (
                <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    className="w-16 h-10 mx-auto mb-4"
                />
            )}
            <h1 className="text-lg font-bold text-purple-400">{country.name}</h1>
            {country.capital && <p>Capital: {country.capital}</p> /* Display capital if it exists. */}
        
            <button onClick={handleButtonClick} className="bg-purple-400 font-bold p-2 rounded-lg hover:scale-105 transition-all hover:shadow-bxs mt-4">Get population data</button>
            {populationData.length > 0 && (
                <div className="mt-4">
                    <PopulationGraph populationData={populationData} />
                    <h2 className="font-bold">Cities Population</h2>
                    <table className="table-auto w-full mt-4">
                        <thead className="border-solid border-2 border-purple-400 text-xl">
                            <tr className="text-purple-400 font-bold">
                                <th className="px-4 py-2 border-solid border-2 border-purple-400">City</th>
                                <th className="px-4 py-2 border-solid border-2 border-purple-400">Population</th>
                            </tr>
                        </thead>
                        <tbody>
                            {populationData.map((city, index) => (
                                <tr key={index}>
                                    <td className="border-solid border-2 border-purple-400 px-4 py-2">{city.city}</td>
                                    <td className="border-solid border-2 border-purple-400 px-4 py-2">{city.populationCounts[0]?.value || 'Data not available'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Card;
