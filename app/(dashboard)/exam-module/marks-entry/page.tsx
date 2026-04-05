import MarksEntry from '@/feature/dashboard/exam-module/marks-entry';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const MarksEntryPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { batchId, subjectId, level, examId } = searchParams;
    let marksData = null;

    if (batchId && subjectId && level) {
        const query = new URLSearchParams();
        if (batchId) query.append('batchId', batchId);
        if (subjectId) query.append('subjectId', subjectId);
        if (level) query.append('level', level);
        if (examId) query.append('examId', examId);

        const response = await fetchServer(`/marksEntry?${query.toString()}`);
        if (response?.success) {
            marksData = response.marksEntryRecords || [];
        }
    }

    return (
        <div>
            <MarksEntry 
                data={marksData} 
                filters={{ batchId, subjectId, examId, level }} 
            />
        </div>
    );
};

export default MarksEntryPage;