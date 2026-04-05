import AdmitCard from '@/feature/dashboard/exam-module/admit-card';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const AdmitCardPage = async () => {
    const res = await fetchServer('/assigned');
    const students = res?.data || [];

    return (
        <div>
            <AdmitCard students={students} />
        </div>
    );
};

export default AdmitCardPage;