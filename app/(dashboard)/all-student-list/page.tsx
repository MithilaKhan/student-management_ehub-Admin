import AllStudentList from '@/feature/dashboard/all-student-list';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const AllStudentListPage = async () => {
    const res = await fetchServer('/assigned');
    const students = res?.data || [];

    return (
        <div>
            <AllStudentList data={students} />
        </div>
    );
};

export default AllStudentListPage;