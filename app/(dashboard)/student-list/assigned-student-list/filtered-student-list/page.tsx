import FilteredStudentList from "@/feature/dashboard/student-list/assigned-student-list/filtered-student-list/FilteredStudentList";
import React, { Suspense } from 'react';

const filteredStudentListPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-white">Loading students...</div>}>
                <FilteredStudentList />
            </Suspense>
        </div>
    );
};

export default filteredStudentListPage;