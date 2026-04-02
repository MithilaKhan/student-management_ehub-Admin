import BatchList from '@/feature/dashboard/batch-list';
import React from 'react';
import { fetchServer } from '@/lib/fetchServer';

const batchListPage = async () => {

    let fetchedData = [];
    try {
        const res = await fetchServer('/batch');
        if (res?.success) {
            fetchedData = res.data;
        }
    } catch (e) {
        console.error("Failed to fetch batches:", e);
    }

    return (
        <div>
           <BatchList initialData={fetchedData} />
        </div>
    );
};

export default batchListPage;