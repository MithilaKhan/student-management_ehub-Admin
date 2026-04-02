import Overview from '@/feature/dashboard/class-routine/overview';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const overviewPage = async () => {
    const res = await fetchServer('/routine');
    const routines = res?.data || [];

    return (
        <div>
           <Overview data={routines} />
        </div>
    );
};

export default overviewPage;