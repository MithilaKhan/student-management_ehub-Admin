"use client";
import React, { useState } from 'react';
import { UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import AdmitCardForm from './AdmitCardForm';
import { FiCalendar, FiClock, FiDownload } from 'react-icons/fi';
import moment from 'moment';
import toast from 'react-hot-toast';

interface AdmitCardProps {
    students: any[];
}

export default function AdmitCard({ students }: AdmitCardProps) {
    const [examData, setExamData] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDownload = async (userId: string, subjectId: string, subjectName: string) => {
        const key = `${userId}-${subjectId}`;
        setDownloadingId(key);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://10.10.7.47:3200/api/v1';
            const response = await fetch(`${baseUrl}/admit-card/student/${userId}/exams/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to download admit card');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `admit-card-${subjectName}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download admit card');
            console.error(err);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleExamsFetched = (student: any, exams: any[]) => {
        setSelectedStudent(student);
        setExamData(exams);
    };

    return (
        <div className="">
            {/* Select Student Section */}
            <div className="flex items-center gap-2 mb-6">
                <UserOutlined className="text-lg" />
                <h2 className="text-lg font-medium">Select Student</h2>
            </div>

            <div className="pb-10 pt-5">
                <AdmitCardForm students={students} onExamsFetched={handleExamsFetched} />
            </div>

            {/* Admit Card Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <CreditCardOutlined className="text-lg" />
                    <h2 className="text-lg font-medium">Admit Card</h2>
                </div>

                {examData.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-[#ABABAB] border border-dashed border-[#ffffff]/10 rounded-lg">
                        <p>Select a student to view available subject exams</p>
                    </div>
                ) : (
                    <div>
                        {/* Student Info Banner */}
                        {selectedStudent && (
                            <div className="bg-[#1A5FA4]/10 border border-[#1A5FA4]/30 rounded-lg p-5 mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Student Name</p>
                                        <p className="text-white font-semibold mt-1">{selectedStudent.name || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Grade</p>
                                        <p className="text-white font-semibold mt-1">{selectedStudent.gradeName || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Phone</p>
                                        <p className="text-white font-semibold mt-1">{selectedStudent.phoneNumber || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Exam Cards Grid */}
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {examData.map((exam, index) => (
                                <div
                                    key={exam.subjectId + index}
                                    className="bg-[#1e293b]/60 border border-[#ffffff]/10 rounded-xl p-5 hover:border-[#1A5FA4]/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-semibold text-base">{exam.subjectName}</h3>
                                            <span className="text-xs text-[#1E88E5] bg-[#1E88E5]/10 px-2 py-0.5 rounded mt-1 inline-block">
                                                {exam.examDuration} mins
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(selectedStudent?._id, exam.subjectId, exam.subjectName)}
                                            disabled={downloadingId === `${selectedStudent?._id}-${exam.subjectId}`}
                                            title="Download Admit Card"
                                            className="text-[#1A5FA4] hover:text-white hover:bg-[#1A5FA4] p-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            <FiDownload size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[#ABABAB] text-sm">
                                            <FiCalendar size={14} className="text-[#1E88E5]" />
                                            <span>
                                                {exam.examDate ? moment(exam.examDate).format('DD MMM YYYY') : "-"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#ABABAB] text-sm">
                                            <FiClock size={14} className="text-[#1E88E5]" />
                                            <span>
                                                {exam.examDate ? moment(exam.examDate).format('hh:mm A') : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}