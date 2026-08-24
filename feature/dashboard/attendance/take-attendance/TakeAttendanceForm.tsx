"use client";
import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { fetchUrl } from '@/lib/fetchUrl';
import { Level } from '@/type';

const TakeAttendanceForm = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [subjects, setSubjects] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);

    const grade = Form.useWatch('grade', form);
    const subject = Form.useWatch('subject', form);
    const batch = Form.useWatch('batch', form);
    const section = Form.useWatch('section', form);

    useEffect(() => {
        const loadInitialOptions = async () => {
            try {
                const [subRes, batRes, secRes] = await Promise.all([
                    fetchUrl('/subject'),
                    fetchUrl('/batch'),
                    fetchUrl('/section')
                ]);
                if (subRes?.success) setSubjects(subRes?.data);
                if (batRes?.success) setBatches(batRes?.data);
                if (secRes?.success) setSections(secRes?.data);
            } catch (err) {
                console.error("Initial options fetch error:", err);
            }
        };
        loadInitialOptions();
    }, []);


    const handleReset = () => {
        form.resetFields();
    };

    const onFinish = (values: any) => {
        const gradeVal = values.grade || '';
        const subjectVal = values.subject || '';
        const batchVal = values.batch || '';
        const sectionVal = values.section || '';
        const dateVal = values.reportDate ? values.reportDate.format('YYYY-MM-DD') : '';

        const query = new URLSearchParams({
            grade: gradeVal,
            subject: subjectVal,
            batch: batchVal,
            section: sectionVal,
            date: dateVal
        }).toString();

        router.push(`/attendance/take-attendance/filter-take-attendance?${query}`);
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical" className=' md:w-[55%] w-full'>
            <div className="grid grid-cols-1 ">
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Grade</label>}
                    name="grade"
                >
                    <Select
                        options={Object.values(Level).map(level => ({ label: level, value: level }))}
                        placeholder="Select Grade"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
                    name="subject"
                >
                    <Select
                        options={(Array.isArray(subjects) ? subjects : []).map(item => ({ label: item.name, value: item._id }))}
                        placeholder="Select Subject"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Batch</label>}
                    name="batch"
                >
                    <Select
                        options={(Array.isArray(batches) ? batches : []).map(item => ({ label: item.name, value: item._id }))}
                        placeholder="Select Batch"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Section</label>}
                    name="section"
                >
                    <Select
                        options={(Array.isArray(sections) ? sections : []).map(item => ({ label: item.name, value: item._id }))}
                        placeholder="Select Section"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Report Of The Date</label>}
                    name="reportDate"
                    rules={[{ required: true, message: "Please select date" }]}
                >
                    <DatePicker
                        placeholder="mm/dd/yyyy"
                        format="MM/DD/YYYY"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<MdArrowDropDown className="text-white" size={22} />}
                    />
                </Form.Item>


            </div>

            <div className="flex justify-end gap-4 mt-4">
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-[#3E1B1F] text-red-500 h-[40px] px-8 rounded-md hover:bg-[#4E2B2F]"
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="bg-[#1A5FA4] text-white h-[40px] px-8 rounded-md hover:bg-[#1550A0]"
                >
                    Get Filtered Student List
                </button>
            </div>
        </Form>
    );
};

export default TakeAttendanceForm;