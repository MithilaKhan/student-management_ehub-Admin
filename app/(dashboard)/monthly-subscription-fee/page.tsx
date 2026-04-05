import MonthlySubscriptionFee from '@/feature/dashboard/monthly-subscription-fee';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const MonthlySubscriptionFeePage = async ({ searchParams }: { searchParams: Promise<{ month?: string; year?: string }> }) => {
    const params = await searchParams;
    const currentDate = new Date();
    const month = params.month || (currentDate.getMonth() + 1).toString();
    const year = params.year || currentDate.getFullYear().toString();

    const res = await fetchServer(`/subscription/monthly-report?month=${month}&year=${year}`);
    const data = res?.data || {};

    return (
        <div>
            <MonthlySubscriptionFee data={data} />
        </div>
    );
};

export default MonthlySubscriptionFeePage;