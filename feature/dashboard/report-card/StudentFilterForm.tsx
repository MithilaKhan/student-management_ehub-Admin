"use client";
import React from 'react';
import { DatePicker, Form, Select } from 'antd';
import { studentOptions } from '@/constants/dashboard/class-routine-data';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { IoCalendarOutline } from 'react-icons/io5';
import { Level } from '@/type';
import { fetchUrl } from '@/lib/fetchUrl';

const StudentFilterForm = () => {
    const router = useRouter();
    const [subjects, setSubjects] = React.useState<any[]>([]);
    const [batches, setBatches] = React.useState<any[]>([]);
    const [sections, setSections] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [subjectRes, batchRes, sectionRes] = await Promise.all([
                    fetchUrl('/subject'),
                    fetchUrl('/batch'),
                    fetchUrl('/section')
                ]);

                if (subjectRes?.success) setSubjects(subjectRes.data);
                if (batchRes?.success) setBatches(batchRes.data);
                if (sectionRes?.success) setSections(sectionRes.data);
            } catch (error) {
                console.error("Failed to fetch filter options:", error);
            }
        };
        loadInitialData();
    }, []);

    const onFinish = (values: any) => {
        const params = new URLSearchParams({
            gradeName: values.grade || '',
            subjectName: values.subject || '',
            batchName: values.batch || '',
            sectionName: values.section || '',
        });

        router.push(`/student-list/assigned-student-list/filtered-student-list?${params.toString()}`);
    }
    return (
        <Form layout="vertical" className=' md:w-[50%] w-full' onFinish={onFinish}>
            <Form.Item
                label={<label className="block text-sm text-[#9CA3AF]">Grade</label>}
                name="grade"
                rules={[{ required: true, message: "Please select Grade" }]}
            >
                <Select
                    options={Object.values(Level).map(level => ({ label: level, value: level }))}
                    placeholder="Select Grade"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p><MdArrowDropDown color='white' size={22} /></p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
                name="subject"
                rules={[{ required: true, message: "Please select Subject" }]}
            >
                <Select
                    options={subjects.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p><MdArrowDropDown color='white' size={22} /></p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-sm text-[#9CA3AF]">Batch</label>}
                name="batch"
                rules={[{ required: true, message: "Please select Batch" }]}
            >
                <Select
                    options={batches.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p><MdArrowDropDown color='white' size={22} /></p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-sm text-[#9CA3AF]">Section Name</label>}
                name="section"
                rules={[{ required: true, message: "Please select Section" }]}
            >
                <Select
                    options={sections.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Section"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p><MdArrowDropDown color='white' size={22} /></p>}
                />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Select Month</label>}
                    name="month"
                >
                    <DatePicker
                        picker="month"
                        placeholder="Select Month"
                        format="MMMM"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<IoCalendarOutline className="text-gray-400" />}
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Select Year</label>}
                    name="year"
                >
                    <DatePicker
                        picker="year"
                        placeholder="Select Year"
                        format="YYYY"
                        style={{ width: '100%', height: 45 }}
                        suffixIcon={<IoCalendarOutline className="text-gray-400" />}
                    />
                </Form.Item>
            </div>

            <Form.Item className="mt-6 flex justify-end">
                <button type="submit" className=" bg-[#1A5FA4] h-[45px]  px-8 rounded-md text-white">
                    Get Filtered Student List
                </button>
            </Form.Item>
        </Form>
    );
};

export default StudentFilterForm;