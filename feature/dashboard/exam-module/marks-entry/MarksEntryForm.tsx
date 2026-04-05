"use client";
import React, { useEffect, useState } from 'react';
import { Form, Select, Button } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Level } from '@/type';

const MarksEntryForm = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [batches, setBatches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [batchRes, subjectRes, examRes] = await Promise.all([
                    fetchUrl('/batch'),
                    fetchUrl('/subject'),
                    fetchUrl('/exam')
                ]);
                if (batchRes?.success) setBatches(batchRes.data);
                if (subjectRes?.success) setSubjects(subjectRes.data);
                if (examRes?.success) setExams(examRes.data);
            } catch (error) {
                console.error("Failed to fetch filter options", error);
            }
        };
        fetchFilters();
    }, []);

    const onFinish = (values: any) => {
        const params = new URLSearchParams();
        if (values.batchId) params.append('batchId', values.batchId);
        if (values.subjectId) params.append('subjectId', values.subjectId);
        if (values.examId) params.append('examId', values.examId);
        if (values.level) params.append('level', values.level);
        
        router.push(`/exam-module/marks-entry?${params.toString()}`);
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} className='md:w-[50%] w-full p-6 rounded-lg'>
            <Form.Item
                label={<label className="block text-[#9CA3AF]">Level / Grade</label>}
                name="level"
                rules={[{ required: true, message: "Please select Level" }]}
            >
                <Select
                    options={Object.values(Level).map(v => ({ label: v, value: v }))}
                    placeholder="Select Level"
                    showSearch
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Subject Name</label>}
                name="subjectId"
                rules={[{ required: true, message: "Please select Subject" }]}
            >
                <Select
                    options={subjects.map(s => ({ label: s.name, value: s._id }))}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Batch Name</label>}
                name="batchId"
                rules={[{ required: true, message: "Please select Batch" }]}
            >
                <Select
                    options={batches.map(b => ({ label: b.name, value: b._id }))}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Exam Title (Optional)</label>}
                name="examId"
            >
                <Select
                    options={exams.map(e => ({ label: e.name, value: e._id }))}
                    placeholder="Select Exam"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                    allowClear
                />
            </Form.Item>

            <Form.Item className="mt-8 flex justify-end">
                <button type="submit" className="bg-[#1A5FA4] h-[45px] px-10 rounded-md text-white w-full font-medium">
                    Fetch Marks Entry List
                </button>
            </Form.Item>
        </Form>
    );
};

export default MarksEntryForm;
