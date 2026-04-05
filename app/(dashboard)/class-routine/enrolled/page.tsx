import StudentEnrolled from '@/feature/dashboard/class-routine/enrolled';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const enrolledPage = async () => {
    const res = await fetchServer('/assigned');
    const students = res?.data || [];

    return (
        <div>
           <StudentEnrolled data={students}/>
        </div>
    );
};

export default enrolledPage;