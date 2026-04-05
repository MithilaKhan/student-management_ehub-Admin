import ExamList from '@/feature/dashboard/exam-module/exam-list';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const ExamListPage = async () => {
    const res = await fetchServer('/exam');
    const data = res?.data || [];

    return (
        <div>
            <ExamList data={data} />
        </div>
    );
};

export default ExamListPage;