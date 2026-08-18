import FilteredStudentList from "@/feature/dashboard/report-card/filtered-student-list/FilteredStudentList";
import React from "react";

const filteredStudentListPage = () => {
    return (
        <div> 
            <React.Suspense> 
            <FilteredStudentList reportCards={[]} />
            </React.Suspense>
        </div>
    );
};

export default filteredStudentListPage;