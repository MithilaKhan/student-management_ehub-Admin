import MarksEntry from '@/feature/dashboard/exam-module/marks-entry';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const MarksEntryPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
    const params = await searchParams;
    const { batchId, subjectId, level, examId } = params;
    let marksData: any[] | null = null;

    if (batchId && subjectId && level) {
        const marksQuery = new URLSearchParams();
        if (batchId) marksQuery.append('batchId', batchId);
        if (subjectId) marksQuery.append('subjectId', subjectId);
        if (level) marksQuery.append('level', level);
        if (examId) marksQuery.append('examId', examId);

        const [marksRes, subjectRes, batchRes, examRes, assignedRes] = await Promise.all([
            fetchServer(`/marksEntry?${marksQuery.toString()}`).catch(() => null),
            fetchServer(`/subject/${subjectId}`).catch(() => null),
            fetchServer(`/batch/${batchId}`).catch(() => null),
            examId ? fetchServer(`/exam/${examId}`).catch(() => null) : Promise.resolve(null),
            fetchServer(`/assigned/filter?batchName=${batchId}&subjectName=${subjectId}&gradeName=${encodeURIComponent(level)}`).catch(() => null),
        ]);

        const subjectName = subjectRes?.data?.name || '-';
        const batchName = batchRes?.data?.name || '-';
        const examName = examRes?.data?.name || 'Exam';
        const examTotalMarks = examRes?.data?.totalMarks || 100;

        const existingRecords = marksRes?.marksEntryRecords || [];
        const existingRecord = existingRecords.find((r: any) => 
            (!examId || r.examName === examName) && 
            (!subjectName || r.subjectName === subjectName)
        ) || (existingRecords.length > 0 ? existingRecords[0] : null);

        const enrolledStudents: any[] = assignedRes?.data?.items || (Array.isArray(assignedRes?.data) ? assignedRes.data : []);

        const studentsList = enrolledStudents.map((stu: any) => {
            const existingStu = existingRecord?.students?.find(
                (es: any) => String(es.studentId) === String(stu._id)
            );
            return {
                studentId: stu._id,
                name: stu.name,
                grade: existingStu?.grade || level || stu.gradeName || "O'LEVEL",
                marksObtained: existingStu?.marksObtained !== undefined ? existingStu.marksObtained : '',
                totalMarks: existingStu?.totalMarks || examTotalMarks,
                percentage: existingStu?.percentage || existingStu?.parcentage || '',
            };
        });

        const finalStudents = studentsList.length > 0 ? studentsList : (existingRecord?.students || []);

        marksData = [{
            examName,
            subjectName,
            batchName,
            level,
            examId: examId || existingRecord?.examId || '',
            subjectId,
            batchId,
            students: finalStudents,
        }];
    }

    return (
        <div>
            <MarksEntry 
                data={marksData} 
                filters={{ batchId, subjectId, examId, level }} 
            />
        </div>
    );
};

export default MarksEntryPage;