"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React from 'react';
import StudentFilterForm from './StudentFilterForm';
import FilteredStudentList from './filtered-student-list/FilteredStudentList';

interface ReportCardProps {
    initialData: {
        subjects: any[];
        batches: any[];
        sections: any[];
    };
    reportCards: any[] | null;
}

const ReportCard = ({ initialData, reportCards }: ReportCardProps) => {

    return (
        <div className=' w-full h-full'>
            {reportCards ? (
                <FilteredStudentList reportCards={reportCards} />
            ) : (
                <>
                    <HeaderTitle title="Filter Student List" />

                    <div className=" h-[78vh] ">
                        <div className='flex-center w-full h-full '>
                            <StudentFilterForm initialData={initialData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportCard;