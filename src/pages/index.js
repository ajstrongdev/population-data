import axios from 'axios';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Link from 'next/link';

export default function Home() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    let searchstate = 0;

    useEffect(() => {
        function getCountries() {
            axios.get('https://countriesnow.space/api/v0.1/countries/capital')
                .then((response) => {
                    const countryData = response.data.data;

                    // Fetch flags for each country
                    Promise.all(
                        countryData.map((country) => 
                            axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
                                iso2: country.iso2,
                                iso3: country.iso3,
                            })
                            .then((flagResponse) => ({
                                ...country,
                                flag: flagResponse.data.data ? flagResponse.data.data.flag : null,
                            }))
                            .catch(() => ({
                                ...country,
                                flag: null, // In case of error, assign null to flag so that it can be handled in the Card component.
                            }))
                        )
                    )
                    .then((countriesAndFlags) => {
                        setCountries(countriesAndFlags);
                        setLoading(false);
                    })
                })
                .catch((error) => {
                    console.error('Error fetching data: ', error);
                    setLoading(false);
                });
        }

        getCountries();
    }, []);

    function handleSearch(inputId) {
        const searchInput = document.getElementById(inputId).value;
        // Filter countries based on search input
        const filteredCountries = countries.filter(country =>
            country.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setCountries(filteredCountries);
    }

    return (
        <div className="lg:w-[85%] m-auto my-8">
            <h1 className="text-4xl text-center font-bold text-purple-400">Country Data</h1>
            <h3 className="text-purple-400 text-xl font-bold text-center my-2">Made by <Link className="underline" href="https://by.ajstrong.xyz" target="_blank">Adam Salt.</Link></h3>
            {loading && <p>Loading...</p> /* Loading indicator. */} 
            {!loading && (
                <>
                <div className="flex justify-center items-center m-8">
                <input type="text" id="searchInput" placeholder="Search for a country" className="mr-4 bg-slate-900 hover:shadow-bxs transition-all text-purple-400 font-bold p-2 rounded-lg w-full " />
                <button onClick={() => handleSearch('searchInput')} className="bg-purple-400 font-bold p-2 rounded-lg hover:scale-105 transition-all hover:shadow-bxs">Search</button>
                </div>
                <div className="lg:grid lg:grid-cols-2 mt-8">
                    {countries.map((country, index) => (
                        <Card key={index} country={country} />
                    ))}
                </div>
                </>
            )}
        </div>
        
    );
}
