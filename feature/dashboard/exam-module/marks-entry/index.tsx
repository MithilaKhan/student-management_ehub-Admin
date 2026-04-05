"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React from 'react';
import MarksEntryForm from './MarksEntryForm';
import { useRouter } from 'next/navigation';
import MarksEntryDetailed from './MarksEntryDetailed';

interface MarksEntryProps {
    data?: any[] | null;
    filters?: {
        batchId?: string;
        subjectId?: string;
        examId?: string;
        level?: string;
    };
}

const MarksEntry = ({ data, filters }: MarksEntryProps) => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/exam-module/marks-entry');
    };

    // If data is present, we show the first matching record directly
    const selectedRecord = data && data.length > 0 ? data[0] : null;

    return (
        <div className='w-full min-h-screen'>
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="Marks Entry" />
                {selectedRecord && (
                    <button 
                        onClick={handleBack}
                        className="bg-[#3E1B1F] text-red-500 px-6 rounded-md hover:bg-red-500/10"
                    >
                        Back to Filters
                    </button>
                )}
            </div>

            {!selectedRecord ? (
                <div className="min-h-[70vh]">
                    <div className='flex-center w-full h-full'>
                        <MarksEntryForm />
                    </div>
                </div> 
            ) : (
                <div className="mt-4">
                    <MarksEntryDetailed data={selectedRecord} filters={filters} />
                </div>
            )}
        </div>
    );
};

export default MarksEntry;
