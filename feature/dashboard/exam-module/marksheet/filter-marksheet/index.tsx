"use client";
import React, { useState } from 'react'; 
import { Input } from 'antd';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import MarksheetTable from './MarksheetTable';

const FilterMarksheet = () => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    
    const subjectName = searchParams.get('subjectName') || 'All Subjects';
    const batchName = searchParams.get('batchName') || 'All Batches';
    const level = searchParams.get('level') || 'All Levels';

    return (
        <div>
            <div className="flex md:flex-row flex-col-reverse justify-between items-start pb-10">
                {/* Left side: Title and info */}
                <div>
                    <div className="flex items-center gap-2 text-lg font-medium pb-3">
                        <FaRegCalendarAlt className="text-[#F1F1F1]" size={18} />
                        <h2 className='text-[#F1F1F1] text-xl'>Marksheet Report</h2>
                    </div>
                    <div className="mt-1 space-y-1.5 text-[#ABABAB]">
                        <p>
                            <span className="font-semibold pe-1">Level:</span>{" "}
                            {level}
                        </p>
                        <p>
                            <span className="font-semibold pe-1">Subject:</span>{" "}
                            {subjectName}
                        </p>
                        <p>
                            <span className="font-semibold pe-1">Batch:</span>{" "}
                            {batchName}
                        </p>
                    </div>
                </div>

                <Input 
                    placeholder="Search student name or ID" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[280px] md:mb-0 mb-4" 
                    style={{ width: 280, height: 40 }} 
                    prefix={<FiSearch size={20} />} 
                    allowClear
                />
            </div> 
            <MarksheetTable searchTerm={searchTerm} />
        </div>
    );
};

export default FilterMarksheet;