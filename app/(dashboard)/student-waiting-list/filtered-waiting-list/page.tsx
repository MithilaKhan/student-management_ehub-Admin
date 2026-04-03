import FilteredWaitingList from '@/feature/dashboard/student-waiting-list/filtered-waiting-list/FilteredWaitingList';
import React, { Suspense } from 'react';

const filteredWaitingListPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-white">Loading waiting list...</div>}>
                <FilteredWaitingList />
            </Suspense>
        </div>
    );
};

export default filteredWaitingListPage;
