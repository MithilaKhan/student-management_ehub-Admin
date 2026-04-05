import StudentHistory from '@/feature/dashboard/student-history';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const StudentHistoryPage = async ({ searchParams }: { searchParams: Promise<{ studentId?: string }> }) => {
    const params = await searchParams;
    const studentId = params.studentId;

    let initialHistory = [];
    if (studentId) {
        const res = await fetchServer(`/user/history/${studentId}`);
        if (res?.success) {
            initialHistory = Array.isArray(res.data) ? res.data : [res.data];
        }
    }

    return (
        <div>
            <StudentHistory initialHistory={initialHistory} />
        </div>
    );
};

export default StudentHistoryPage;