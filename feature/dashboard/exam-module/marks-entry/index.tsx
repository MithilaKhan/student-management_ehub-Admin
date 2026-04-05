"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React from 'react';
import MarksEntryForm from './MarksEntryForm';
import MarksEntryTable from './MarksEntryTable';
import { useRouter } from 'next/navigation';

interface MarksEntryProps {
    data?: any[] | null;
}

const MarksEntry = ({ data }: MarksEntryProps) => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/exam-module/marks-entry');
    };

    return (
        <div className='w-full min-h-screen'>
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="Marks Entry" />
                {data && (
                    <button 
                        onClick={handleBack}
                        className="bg-[#3E1B1F] text-red-500 h-[40px] px-6 rounded-md hover:bg-red-500/10"
                    >
                        Back to Filters
                    </button>
                )}
            </div>

            {!data ? (
                <div className="min-h-[70vh]">
                    <div className='flex-center w-full h-full'>
                        <MarksEntryForm />
                    </div>
                </div> 
            ) : (
                <div className="mt-4">
                    <MarksEntryTable data={data} />
                </div>
            )}
        </div>
    );
};

export default MarksEntry;