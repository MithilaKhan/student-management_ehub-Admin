"use client";
import React, { useState } from "react";
import { Form, Select, Spin } from "antd";
import { MdArrowDropDown } from "react-icons/md";
import { fetchUrl } from "@/lib/fetchUrl";

interface AdmitCardFormProps {
    students: any[];
    onExamsFetched: (student: any, exams: any[]) => void;
}

const AdmitCardForm = ({ students, onExamsFetched }: AdmitCardFormProps) => {
    const [loading, setLoading] = useState(false);

    const handleStudentChange = async (studentId: string) => {
        const student = students.find(s => s._id === studentId);
        if (!student) return;

        setLoading(true);
        try {
            const res = await fetchUrl(`/admit-card/student/exams/${studentId}`);
            if (res?.success) {
                onExamsFetched(student, res.data || []);
            } else {
                onExamsFetched(student, []);
            }
        } catch (error) {
            console.error("Failed to fetch admit card data", error);
            onExamsFetched(student, []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-[50%] w-full">
            <Form layout="vertical">
                <Form.Item
                    label={<label className="text-[#9CA3AF]">Student Name</label>}
                    name="student"
                    rules={[{ required: true, message: "Please select Student" }]}
                >
                    <Select
                        options={students.map(s => ({ label: s.name, value: s._id }))}
                        placeholder="Select Student Name"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: "100%", height: 45 }}
                        suffixIcon={loading ? <Spin size="small" /> : <MdArrowDropDown color="white" size={22} />}
                        className="custom-dark-select"
                        onChange={handleStudentChange}
                        loading={loading}
                    />
                </Form.Item>
                {loading && (
                    <div className="flex items-center gap-2 text-[#ABABAB] text-sm mt-1">
                        <Spin size="small" />
                        <span>Fetching exam schedule...</span>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default AdmitCardForm;
