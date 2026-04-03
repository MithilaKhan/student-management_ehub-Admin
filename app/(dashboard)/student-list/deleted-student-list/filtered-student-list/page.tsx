import FilteredStudentList from "@/feature/dashboard/student-list/deleted-student-list/filtered-student-list/FilteredStudentList";
import React, { Suspense } from 'react';

const filteredStudentListPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-white">Loading deleted students...</div>}>
                <FilteredStudentList />
            </Suspense>
        </div>
    );
};

export default filteredStudentListPage;