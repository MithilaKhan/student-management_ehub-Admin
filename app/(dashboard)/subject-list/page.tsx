import SubjectList from '@/feature/dashboard/subject-list';
import React from 'react';
import { fetchServer } from '@/lib/fetchServer';

const subjectListPage = async () => {

    // 2. 100% Server-Side Data Fetch!
    let fetchedData = [];
    try {
        const res = await fetchServer('/subject');
        if (res?.success) {
            fetchedData = res.data;
        }
    } catch (e) {
        console.error("Failed to fetch subjects:", e);
    }

    return (
        <div>
           <SubjectList initialData={fetchedData} />
        </div>
    );
};

export default subjectListPage;