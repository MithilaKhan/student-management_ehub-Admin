import FilterMarksheet from '@/feature/dashboard/exam-module/marksheet/filter-marksheet';
import React, { Suspense } from 'react';

const FilterMarksheetPage = () => {
    return (
        <Suspense fallback={<div className="text-white p-6">Loading marksheet...</div>}>
           <FilterMarksheet />
        </Suspense>
    );
};

export default FilterMarksheetPage;