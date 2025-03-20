/* eslint-disable react/prop-types */
import { useEffect } from 'react';

function DateFilter({ setStartDate, setEndDate, startDate, endDate }) {

    // Load the saved dates from localStorage when the component mounts
    useEffect(() => {
        const savedStartDate = localStorage.getItem('startDate');
        const savedEndDate = localStorage.getItem('endDate');

        if (savedStartDate) setStartDate(savedStartDate);
        if (savedEndDate) setEndDate(savedEndDate);
    }, [setStartDate, setEndDate]);

    const clearDates = () => {
        setStartDate("");
        setEndDate("");
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
    };

    return (
        <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4 flex-1'>
                <label htmlFor="" className="flex text-xl items-center gap-4">
                    From
                    <input
                        className="w-64 text-xl border border-gray-300 px-8 py-4 rounded-lg focus:outline-primary"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            localStorage.setItem('startDate', e.target.value); // Save to localStorage
                        }}
                        type="date"
                    />
                </label>
                <label htmlFor="" className="flex text-xl items-center gap-4">
                    To
                    <input
                        className="w-64 text-xl border border-gray-300 px-8 py-4 rounded-lg focus:outline-primary"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            localStorage.setItem('endDate', e.target.value); // Save to localStorage
                        }}
                        type="date"
                    />
                </label>
                <button
                    className="px-4 py-2 bg-dark text-white rounded-lg hover:bg-dark-hover cursor-pointer"
                    onClick={clearDates}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default DateFilter;
