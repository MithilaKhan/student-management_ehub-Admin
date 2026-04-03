"use client";
import { useSearchParams } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';
import moment from "moment";
import StudentReportTable from './FilteredStudentTable';

const FilteredStudentList = () => {
    const search = useSearchParams();
    const subject = search?.get("subject") ?? "IAL Accounting A2";
    const batch = search?.get("batch") ?? "IAL - A2 Accounting May 2026 B#1";
    const section = search?.get("section") ?? "Batch 01";
    const grade = search?.get("grade") ?? "A+";
    const month = search?.get("month") ?? moment().format("MMMM");
    const year = search?.get("year") ?? moment().format("YYYY");

    return (
        <div>
            <div className="">
                {/* header */}
                <div className="flex md:flex-row flex-col items-start justify-between md:space-y-0 space-y-4 pb-5 ">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-[#1e293b]">
                            <FiEdit className="text-white" />
                        </div>
                        <h3 className="text-white text-lg font-medium">
                            Filtered Student List For Attendance
                        </h3>
                    </div>

                    <div className=" pe-4">
                        <div className="text-[#1E88E5] font-semibold md:text-2xl text-xl md:flex-center gap-1 ">
                            <span> {month} </span> <span> {year}</span>
                        </div>
                        <div className="text-[16px] text-[#ABABAB] mt-2 grid md:grid-cols-2 grid-cols-1 gap-y-1">
                            <div><span className='font-medium pe-1'>Grade:</span>{grade}</div>
                            <div><span className='font-medium pe-1'>Subject:</span>{subject}</div>
                            <div><span className='font-medium pe-1'>Batch:</span>{batch}</div>
                            <div><span className='font-medium pe-1'>Section:</span>{section}</div>
                        </div>
                    </div>
                </div>
                <StudentReportTable  />
            </div>
        </div>
    );
};

export default FilteredStudentList;