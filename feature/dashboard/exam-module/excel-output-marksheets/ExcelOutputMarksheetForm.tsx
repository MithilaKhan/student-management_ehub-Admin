"use client";
import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { MdArrowDropDown } from "react-icons/md";
import { Level } from "@/type";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const ExcelOutputMarksheetForm = () => {
    const [form] = Form.useForm();
    const [batches, setBatches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [batchRes, subjectRes, examRes] = await Promise.all([
                    fetchUrl('/batch'),
                    fetchUrl('/subject'),
                    fetchUrl('/exam')
                ]);
                if (batchRes?.success) setBatches(batchRes.data || []);
                if (subjectRes?.success) setSubjects(subjectRes.data || []);
                if (examRes?.success) setExams(examRes.data || []);
            } catch (error) {
                console.error("Failed to load filter options", error);
            }
        };
        fetchFilters();
    }, []);

    const onFinish = async (values: any) => {
        try {
            setDownloading(true);
            const params = new URLSearchParams();
            if (values.level) params.append('level', values.level);
            if (values.subjectId) params.append('subjectId', values.subjectId);
            if (values.batchId) params.append('batchId', values.batchId);
            if (values.examId) params.append('examId', values.examId);

            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://10.10.7.47:3200/api/v1';
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            const response = await fetch(`${BASE_URL}/marksEntry/download?${params.toString()}`, {
                method: 'GET',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to download marksheet');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `marksheet_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Marksheet downloaded successfully');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to download marksheet');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} className="lg:w-[70%] w-full bg-transparent">
            {/* Grade */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Grade</label>}
                name="level"
                rules={[{ required: true, message: "Please select Grade" }]}
            >
                <Select
                    options={Object.values(Level).map(v => ({ label: v, value: v }))}
                    placeholder="Select Grade"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Subject */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Subject</label>}
                name="subjectId"
                rules={[{ required: true, message: "Please select Subject" }]}
            >
                <Select
                    options={subjects.map(s => ({ label: s.name, value: s._id }))}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Batch */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Batch</label>}
                name="batchId"
                rules={[{ required: true, message: "Please select Batch" }]}
            >
                <Select
                    options={batches.map(b => ({ label: b.name, value: b._id }))}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Exam (Optional) */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Exam (Optional)</label>}
                name="examId"
            >
                <Select
                    options={exams.map(e => ({ label: e.name || e.title, value: e._id }))}
                    placeholder="Select Exam (Optional)"
                    showSearch
                    optionFilterProp="label"
                    allowClear
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Buttons */}
            <Form.Item className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={downloading}
                    className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer disabled:opacity-50"
                >
                    {downloading ? "Downloading..." : "Excel Marksheet"}
                </button>
            </Form.Item>
        </Form>
    );
};

export default ExcelOutputMarksheetForm;
