"use client";
import React, { useState, useEffect } from 'react';
import HeaderTitle from '@/shared/HeaderTitle';
import { Input } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';

interface EditMarksEntryProps {
    data: any;
    id: string;
}

const EditMarksEntry = ({ data, id }: EditMarksEntryProps) => {
    const router = useRouter();

    // Build state for student marks: { [studentId]: { paper1: string } }
    const [marks, setMarks] = useState<Record<string, { paper1: string }>>({});
    const [loading, setLoading] = useState(false);

    const examInfo = data?.examId || {};
    const subjectInfo = data?.subjectId || {};
    const batchInfo = data?.batchId || {};
    const students: any[] = data?.students || [];
    const totalMarks = examInfo?.totalMarks || 0;

    // Initialize state from existing data
    useEffect(() => {
        if (students.length > 0) {
            const initial: Record<string, { paper1: string }> = {};
            students.forEach((s: any) => {
                initial[s._id] = {
                    paper1: s.marks !== undefined && s.marks !== null ? String(s.marks) : '',
                };
            });
            setMarks(initial);
        }
    }, [data]);

    const getPaperValue = (studentId: string) => marks[studentId]?.paper1 ?? '';

    const getTotal = (studentId: string) => {
        const val = getPaperValue(studentId);
        if (val === '' || val === undefined) return '';
        const num = parseFloat(val);
        return isNaN(num) ? '' : String(num);
    };

    const getPercentage = (studentId: string) => {
        const val = getPaperValue(studentId);
        if (val === '' || !totalMarks) return '';
        const num = parseFloat(val);
        if (isNaN(num)) return '';
        return ((num / totalMarks) * 100).toFixed(2);
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
            reset[s._id] = { paper1: '' };
        });
        setMarks(reset);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const studentMarks = students.map((s: any) => ({
                studentId: s._id,
                marks: marks[s._id]?.paper1 !== '' ? parseFloat(marks[s._id]?.paper1 || '0') : null,
            }));

            const res = await fetchUrl(`/marksEntry/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ studentMarks }),
            });

            if (res?.success) {
                toast.success('Marks updated successfully');
            } else {
                toast.error(res?.message || 'Failed to update marks');
            }
        } catch (err) {
            toast.error('An error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <HeaderTitle title="Edit Student Marks" />
                <button
                    onClick={() => router.back()}
                    className="bg-[#3E1B1F] text-red-400 h-[38px] px-5 rounded-md hover:bg-red-500/10 text-sm"
                >
                    ← Back
                </button>
            </div>

            {/* Exam Title Banner */}
            <div className="text-center mb-6 py-4 bg-[#1A5FA4]/10 border border-[#1A5FA4]/30 rounded-xl">
                <h2 className="text-xl font-bold text-white">
                    Exam:{' '}
                    <span className="text-[#1E88E5]">
                        {examInfo?.name || '-'}{' '}
                        {examInfo?.date ? moment(examInfo.date).format('DD MMM YYYY') : ''}
                    </span>
                </h2>
            </div>

            {/* Info Block */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg p-5">
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Subject</p>
                    <p className="text-white font-semibold mt-1">{subjectInfo?.name || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Batch</p>
                    <p className="text-white font-semibold mt-1">{batchInfo?.name || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Total Marks</p>
                    <p className="text-[#1E88E5] font-bold mt-1">{totalMarks}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Exam Type</p>
                    <p className="text-white font-semibold mt-1">{examInfo?.examType?.replace(/_/g, ' ') || '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Duration</p>
                    <p className="text-white font-semibold mt-1">{examInfo?.duration ? `${examInfo.duration} mins` : '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Score Format</p>
                    <p className="text-white font-semibold mt-1">{examInfo?.scoreFormat || '-'}</p>
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
                    No students found for this marks entry record.
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
                                    key={student._id}
                                    className="border-b border-[#ffffff]/5 hover:bg-[#ffffff]/5 transition-colors"
                                >
                                    <td className="px-4 py-3 text-[#ABABAB]">{index + 1}</td>
                                    <td className="px-4 py-3 text-white font-medium">
                                        {student.name || student.studentName || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            value={getPaperValue(student._id)}
                                            onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                            placeholder="Enter marks"
                                            style={{ height: 38 }}
                                            className="rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={getTotal(student._id)}
                                            disabled
                                            placeholder="-"
                                            style={{ height: 38 }}
                                            className="rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            value={getPercentage(student._id)}
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

export default EditMarksEntry;
