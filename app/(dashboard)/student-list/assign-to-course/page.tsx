import AssignToCourse from '@/feature/dashboard/student-list/assign-to-course';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const assignToCoursePage = async () => {
    const [studentRes, subjectRes, batchRes, sectionRes] = await Promise.all([
        fetchServer('/assigned'),
        fetchServer('/subject'),
        fetchServer('/batch'),
        fetchServer('/section')
    ]);

    const initialData = {
        students: studentRes?.data || [],
        subjects: subjectRes?.data || [],
        batches: batchRes?.data || [],
        sections: sectionRes?.data || []
    };

    return (
        <div>
            <AssignToCourse initialData={initialData} />
        </div>
    );
};

export default assignToCoursePage;