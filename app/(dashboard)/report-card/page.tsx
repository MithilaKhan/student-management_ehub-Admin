import ReportCard from '@/feature/dashboard/report-card';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const ReportCardPage = async ({ searchParams }: { searchParams: Promise<{ gradeName?: string; subjectName?: string; batchName?: string; sectionName?: string }> }) => {
    const params = await searchParams;
    const { gradeName, subjectName, batchName, sectionName } = params;

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
        const reportCardRes = await fetchServer(`/reportCard?gradeName=${gradeName}&subjectName=${subjectName}&batchName=${batchName}&sectionName=${sectionName}`);
        reportCards = reportCardRes?.data || [];
    }

    return (
        <div>
           <ReportCard initialData={initialData} reportCards={reportCards} />
        </div>
    );
};

export default ReportCardPage;