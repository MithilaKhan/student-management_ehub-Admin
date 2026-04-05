"use client";
import { useSearchParams } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';
import moment from "moment";
import StudentReportTable from './FilteredStudentTable';

interface FilteredStudentListProps {
    reportCards: any[];
}

const FilteredStudentList = ({ reportCards }: FilteredStudentListProps) => {
    const search = useSearchParams();

    const subject = reportCards?.[0]?.subjectName?.name || "-";
    const batch = reportCards?.[0]?.batchName?.name || "-";
    const section = reportCards?.[0]?.sectionName?.name || "-";
    const grade = reportCards?.[0]?.gradeName || "-";
    const month = search?.get("month") || moment().format("MMMM");
    const year = search?.get("year") || moment().format("YYYY");

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
                            Filtered Student List For Report Card
                        </h3>
                    </div>

                    <div className=" pe-4">
                        <div className="text-[#1E88E5] font-semibold md:text-2xl text-xl md:flex-center gap-1 ">
                            <span> {month} </span> <span> {year}</span>
                        </div>
                        <div className="text-[14px] text-[#D1D5DB] mt-3 grid md:grid-cols-2 grid-cols-1 gap-y-3 gap-x-6 bg-[#ffffff]/5 p-4 rounded-lg border border-[#ffffff]/10">
                            <div className="flex items-center"><span className='font-semibold text-white min-w-[70px] uppercase text-xs tracking-wider'>Grade:</span><span className="text-[#1E88E5] font-semibold bg-[#1E88E5]/10 px-2 py-0.5 rounded ml-2">{grade}</span></div>
                            <div className="flex items-center"><span className='font-semibold text-white min-w-[70px] uppercase text-xs tracking-wider'>Subject:</span><span className="ml-2">{subject}</span></div>
                            <div className="flex items-center"><span className='font-semibold text-white min-w-[70px] uppercase text-xs tracking-wider'>Batch:</span><span className="ml-2">{batch}</span></div>
                            <div className="flex items-center"><span className='font-semibold text-white min-w-[70px] uppercase text-xs tracking-wider'>Section:</span><span className="ml-2">{section}</span></div>
                        </div>
                    </div>
                </div>
                <StudentReportTable data={reportCards} />
            </div>
        </div>
    );
};

export default FilteredStudentList;
