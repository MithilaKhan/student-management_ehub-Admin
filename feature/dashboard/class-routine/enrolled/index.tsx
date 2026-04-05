"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React, { useState } from 'react';
import { Form, Select, Spin, Empty } from 'antd';
import { MdArrowDropDown, MdLocationOn } from 'react-icons/md';
import { FiCalendar, FiClock, FiBook, FiUsers, FiLayers } from 'react-icons/fi';
import { fetchUrl } from '@/lib/fetchUrl';

interface StudentEnrolledProps {
    data: any[];
}

const StudentEnrolled = ({ data }: StudentEnrolledProps) => {
    const [loading, setLoading] = useState(false);
    const [routineData, setRoutineData] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const studentOptions = data?.map((student: any) => ({
        label: student.name,
        value: student._id,
    }));

    const handleStudentChange = async (studentId: string) => {
        const student = data.find(s => s._id === studentId);
        setSelectedStudent(student);
        setLoading(true);
        try {
            const res = await fetchUrl(`/routine/student/${studentId}`);
            if (res?.success) {
                setRoutineData(res.data || []);
            } else {
                setRoutineData([]);
            }
        } catch (error) {
            console.error("Failed to fetch routine data", error);
            setRoutineData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedStudent(null);
        setRoutineData([]);
    };

    return (
        <div className='w-full min-h-screen pb-10'>
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title={selectedStudent ? "Student Routine" : "Select Student"} />
                {selectedStudent && (
                    <button 
                        onClick={handleReset}
                        className="bg-[#3E1B1F] text-red-500 h-[38px] px-5 rounded-md hover:bg-red-500/10 text-sm"
                    >
                        Reset Filter
                    </button>
                )}
            </div>

            {!selectedStudent ? (
                <div className="h-[60vh] flex-center">
                    <div className="md:w-[50%] w-full">
                        <Form layout="vertical">
                            <Form.Item
                                label={<label className="block text-[#9CA3AF]">Student Name</label>}
                                name="studentName"
                                rules={[{ required: true, message: "Please select a student" }]}
                            >
                                <Select
                                    options={studentOptions}
                                    placeholder="Select Student"
                                    showSearch
                                    optionFilterProp="label"
                                    style={{ width: '100%', height: 45 }} 
                                    suffixIcon={<MdArrowDropDown color='white' size={22}/>}
                                    onChange={handleStudentChange}
                                    className="custom-dark-select"
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Student Info Banner */}
                    <div className="bg-[#1A5FA4]/10 border border-[#1A5FA4]/30 rounded-xl p-5 flex flex-wrap gap-6 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#1A5FA4] rounded-full flex items-center justify-center text-white text-xl font-bold uppercase">
                                {selectedStudent.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-white text-lg font-bold">{selectedStudent.name}</h3>
                                <p className="text-[#ABABAB] text-sm uppercase tracking-wider">Student ID: {selectedStudent._id?.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Level</p>
                                <p className="text-white font-semibold mt-1">{selectedStudent.level || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#ABABAB] uppercase tracking-wider">Active Status</p>
                                <p className="text-[#11D279] font-semibold mt-1 uppercase text-xs">Active</p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-[40vh] flex flex-col items-center justify-center gap-3 text-[#ABABAB]">
                            <Spin size="large" />
                            <p>Loading class routine...</p>
                        </div>
                    ) : routineData.length === 0 ? (
                        <div className="h-[40vh] flex-center bg-[#ffffff]/5 border border-dashed border-[#ffffff]/10 rounded-xl">
                            <Empty description={<span className="text-[#ABABAB]">No routine found for this student.</span>} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {routineData.map((routine, idx) => (
                                <div key={routine._id || idx} className="bg-[#1e1e24] border border-[#ffffff]/10 rounded-xl p-5 hover:border-[#1A5FA4]/50 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-[#1A5FA4]/20 p-2 rounded-lg group-hover:bg-[#1A5FA4] transition-colors">
                                            <FiBook size={20} className="text-[#1A5FA4] group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs bg-[#11D279]/10 text-[#11D279] px-2 py-0.5 rounded uppercase font-medium">Ongoing</span>
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold text-lg mb-4 line-clamp-1">{routine.name || "Untitled Routine"}</h4>

                                    <div className="space-y-3 mb-5 border-y border-[#ffffff]/5 py-4">
                                        <div className="flex items-center gap-3 text-sm text-[#ABABAB]">
                                            <FiLayers size={14} className="text-[#1A5FA4]" />
                                            <span>Subject: <span className="text-white">{routine.subjectName?.name || "-"}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#ABABAB]">
                                            <FiUsers size={14} className="text-[#1A5FA4]" />
                                            <span>Batch: <span className="text-white">{routine.batchName?.name || "-"}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#ABABAB]">
                                            <MdLocationOn size={14} className="text-[#1A5FA4]" />
                                            <span>Room: <span className="text-white">{routine.location || "-"}</span></span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs text-[#ABABAB] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-3 bg-[#1A5FA4] rounded-full"></span>
                                            Schedule
                                        </p>
                                        <div className="grid gap-2">
                                            {routine.day?.map((day: string, i: number) => (
                                                <div key={i} className="bg-[#ffffff]/5 rounded-lg p-3 flex flex-wrap justify-between items-center gap-2 border border-transparent hover:border-[#ffffff]/10">
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar className="text-[#1E88E5]" size={14} />
                                                        <span className="text-white font-medium text-sm">{day}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[#ABABAB] text-xs">
                                                        <FiClock className="text-[#1E88E5]" size={12} />
                                                        <span>{routine.startTime?.[i]} - {routine.endTime?.[i]}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentEnrolled;