import ReportCard from '@/feature/dashboard/report-card';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const ReportCardPage = async ({ searchParams }: { searchParams: Promise<{ gradeName?: string; subjectName?: string; batchName?: string; sectionName?: string; month?: string; year?: string }> }) => {
    const params = await searchParams;
    const { gradeName, subjectName, batchName, sectionName, month, year } = params;

    const [subjectRes, batchRes, sectionRes] = await Promise.all([
        fetchServer('/subject'),
        fetchServer('/batch'),
        fetchServer('/section')
    ]);

    const initialData = {
        subjects: subjectRes?.data || [],
        batches: batchRes?.data || [],
        sections: sectionRes?.data || []
    };

    let reportCards = null;
    if (gradeName && subjectName && batchName && sectionName) {
        const query = new URLSearchParams({
            level: gradeName,
            gradeName,
            subject: subjectName,
            subjectName,
            batch: batchName,
            batchName,
            section: sectionName,
            sectionName,
        });
        if (month) query.append('month', month);
        if (year) query.append('year', year);

        const reportCardRes = await fetchServer(`/reportCard?${query.toString()}`);
        reportCards = reportCardRes?.data || [];
    }

    return (
        <div>
           <ReportCard initialData={initialData} reportCards={reportCards} />
        </div>
    );
};

export default ReportCardPage;