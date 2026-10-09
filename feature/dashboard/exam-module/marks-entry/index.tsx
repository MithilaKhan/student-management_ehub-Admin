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

    const isFiltered = Boolean(filters?.batchId && filters?.subjectId && filters?.level);
    const selectedRecord = data && data.length > 0 ? data[0] : null;

    return (
        <div className='w-full min-h-screen'>
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="Marks Entry" />
                {isFiltered && (
                    <button 
                        onClick={handleBack}
                        className="bg-[#3E1B1F] text-red-500 px-6 py-2 rounded-md hover:bg-red-500/10 cursor-pointer transition-colors"
                    >
                        Back to Filters
                    </button>
                )}
            </div>

            {!isFiltered ? (
                <div className="min-h-[70vh]">
                    <div className='flex-center w-full h-full'>
                        <MarksEntryForm />
                    </div>
                </div> 
            ) : (
                <div className="mt-4">
                    <MarksEntryDetailed data={selectedRecord || { students: [] }} filters={filters} />
                </div>
            )}
        </div>
    );
};

export default MarksEntry;
