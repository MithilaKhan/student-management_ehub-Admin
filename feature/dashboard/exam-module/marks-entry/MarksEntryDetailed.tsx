"use client";
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';

interface MarksEntryDetailedProps {
    data: any;
    filters?: {
        batchId?: string;
        subjectId?: string;
        examId?: string;
        level?: string;
    };
}

const MarksEntryDetailed = ({ data, filters }: MarksEntryDetailedProps) => {
    // Build state for student marks: { [studentId]: { paper1: string } }
    const [marks, setMarks] = useState<Record<string, { paper1: string }>>({});
    const [loading, setLoading] = useState(false);

    const students: any[] = data?.students || [];

    // Initialize state from existing data
    useEffect(() => {
        if (students.length > 0) {
            const initial: Record<string, { paper1: string }> = {};
            students.forEach((s: any) => {
                const val = s.marksObtained !== undefined && s.marksObtained !== null ? String(s.marksObtained) : '';
                initial[s.studentId] = {
                    paper1: val,
                };
            });
            setMarks(initial);
        }
    }, [data]);

    const getPaperValue = (studentId: string) => marks[studentId]?.paper1 ?? '';

    const getPercentage = (studentId: string, totalMarks: number) => {
        const val = getPaperValue(studentId);
        if (val === '' || !totalMarks) return '';
        const num = parseFloat(val);
        if (isNaN(num)) return '';
        return ((num / totalMarks) * 100).toFixed(2) + '%';
    };

    const handleMarkChange = (studentId: string, value: string) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: { paper1: value },
        }));
    };

    const handleReset = () => {
        const reset: Record<string, { paper1: string }> = {};
        students.forEach((s: any) => {
            reset[s.studentId] = { paper1: '' };
        });
        setMarks(reset);
    };

    const handleSubmit = async () => {
        // Prioritize IDs from filters (from search params) then from the data object
        const examId = filters?.examId || data?.examId?._id || data?.examId || "";
        const subjectId = filters?.subjectId || data?.subjectId?._id || data?.subjectId || "";
        const batchId = filters?.batchId || data?.batchId?._id || data?.batchId || "";

        if (!examId || !subjectId || !batchId) {
            toast.error("Missing required IDs (Exam, Subject, or Batch).");
            return;
        }
        
        setLoading(true);
        try {
            const studentMarks = students.map((s: any) => {
                const markVal = marks[s.studentId]?.paper1;
                const marksObtained = markVal !== '' ? parseFloat(markVal || '0') : 0;
                const totalMarks = s.totalMarks || 0;
                
                // Using "parcentage" spelling as per user's Postman screenshot
                const parcentage = totalMarks > 0 
                    ? String(((marksObtained / totalMarks) * 100).toFixed(0)) 
                    : "0";

                return {
                    studentId: s.studentId,
                    marksObtained,
                    totalMarks,
                    parcentage
                };
            });

            const payload = {
                examId,
                subjectId,
                batchId,
                students: studentMarks
            };

            const res = await fetchUrl('/marksEntry', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (res?.success) {
                toast.success('Marks updated and sent successfully');
            } else {
                toast.error(res?.message || 'Failed to submit marks');
            }
        } catch (err) {
            toast.error('An error occurred during submission');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Exam Title Banner */}
            <div className="text-center mb-6 py-4 bg-[#1A5FA4]/10 border border-[#1A5FA4]/30 rounded-xl">
                <h2 className="text-xl font-bold text-white">
                    Exam: <span className="text-[#1E88E5]">{data?.examName || '-'}</span>
                </h2>
            </div>

            {/* Info Block */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg p-5">
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Subject</p>
                    <p className="text-white font-semibold mt-1">{data?.subjectName || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Batch</p>
                    <p className="text-white font-semibold mt-1">{data?.batchName || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Level</p>
                    <p className="text-[#1E88E5] font-bold mt-1">{data?.level || '-'}</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg p-5">
                <h3 className="text-[#1E88E5] font-semibold mb-3 underline cursor-pointer">How to Input Marks</h3>
                <ul className="space-y-1.5 text-sm">
                    <li>
                        <span className="text-red-400 font-semibold">** Input 0-Any number:</span>{' '}
                        <span className="text-[#ABABAB]">Means it will be sent as mark.</span>
                    </li>
                    <li>
                        <span className="text-red-400 font-semibold">** Input No number:</span>{' '}
                        <span className="text-[#ABABAB]">Means student didn't appear in the exam.</span>
                    </li>
                    <li>
                        <span className="text-red-400 font-semibold">** Input -1:</span>{' '}
                        <span className="text-[#ABABAB]">Means while sending mark through SMS this student or their parents won't get SMS.</span>
                    </li>
                </ul>
            </div>

            {/* Marks Table */}
            {students.length === 0 ? (
                <div className="text-center py-16 text-[#ABABAB] border border-dashed border-[#ffffff]/10 rounded-lg">
                    No students found for this filter.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-[#ffffff]/10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#ffffff]/10 bg-[#ffffff]/5">
                                <th className="text-left px-4 py-3 text-[#ABABAB] font-medium w-[60px]">Sl.</th>
                                <th className="text-left px-4 py-3 text-[#ABABAB] font-medium">Student Name</th>
                                <th className="text-left px-4 py-3 text-[#ABABAB] font-medium w-[200px]">Paper 1</th>
                                <th className="text-left px-4 py-3 text-[#ABABAB] font-medium w-[200px]">Total Mark</th>
                                <th className="text-left px-4 py-3 text-[#ABABAB] font-medium w-[200px]">Percentage %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student: any, index: number) => (
                                <tr
                                    key={student.studentId}
                                    className="border-b border-[#ffffff]/5 hover:bg-[#ffffff]/5 transition-colors"
                                >
                                    <td className="px-4 py-3 text-[#ABABAB]">{index + 1}</td>
                                    <td className="px-4 py-3 text-white font-medium">
                                        {student.name || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            value={getPaperValue(student.studentId)}
                                            onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
                                            placeholder="Enter marks"
                                            style={{ height: 38 }}
                                            className="rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={student.totalMarks || student.examId?.totalMarks || ''}
                                            disabled
                                            placeholder="-"
                                            style={{ height: 38 }}
                                            className="rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={getPercentage(student.studentId, student.totalMarks)}
                                            disabled
                                            placeholder="-"
                                            style={{ height: 38 }}
                                            className="rounded-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={handleReset}
                    className="bg-[#3E1B1F] text-red-400 h-[42px] px-8 rounded-md hover:bg-red-500/10 font-medium"
                >
                    Reset
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || students.length === 0}
                    className="bg-[#1A5FA4] text-white h-[42px] px-10 rounded-md hover:bg-[#1A5FA4]/80 font-medium disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default MarksEntryDetailed;
