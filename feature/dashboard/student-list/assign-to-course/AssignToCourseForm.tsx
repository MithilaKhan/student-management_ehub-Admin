"use client";
import React, { useState } from 'react';
import { Form, Select } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Level } from '@/type';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';

interface AssignToCourseFormProps {
    initialData: {
        students: any[];
        subjects: any[];
        batches: any[];
        sections: any[];
    };
}

const AssignToCourseForm = ({ initialData }: AssignToCourseFormProps) => {  
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const onFinish = async (values: any) => {
        const studentId = values.studentId || values.studentName;
        try {
            setSubmitting(true);
            const res = await fetchUrl(`/assigned/${studentId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    gradeName: values.gradeName,
                    subjectName: values.subjectName,
                    batchName: values.batchName,
                    sectionName: values.sectionName,
                }),
            });

            if (res?.success) {
                toast.success(res?.message || 'Student enrolled to course successfully!');
                const params = new URLSearchParams({
                    gradeName: values.gradeName || '',
                    subjectName: values.subjectName || '',
                    batchName: values.batchName || '',
                    sectionName: values.sectionName || '',
                });
                router.push(`/student-list/assigned-student-list/filtered-student-list?${params.toString()}`);
            } else {
                toast.error(res?.message || 'Failed to enroll student');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to enroll student to course');
        } finally {
            setSubmitting(false);
        }
    };

    const studentOptions = initialData.students?.map(item => ({ label: `${item.name}${item.email ? ` (${item.email})` : ''}`, value: item._id })) || [];
    const subjectOptions = initialData.subjects?.map(item => ({ label: item.name, value: item._id })) || [];
    const batchOptions = initialData.batches?.map(item => ({ label: item.name, value: item._id })) || [];
    const sectionOptions = initialData.sections?.map(item => ({ label: item.name, value: item._id })) || [];
    const gradeOptions = Object.values(Level).map(level => ({ label: level, value: level }));

    return (
        <Form layout="vertical" className='md:w-[50%] w-[100%]' onFinish={onFinish}>
            <Form.Item
                label={<label className="block text-[#9CA3AF]">Student Name</label>}
                name="studentId"
                rules={[{ required: true, message: "Please select Student" }]}
            >
                <Select
                    options={studentOptions}
                    placeholder="Select Student"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Grade Name</label>}
                name="gradeName"
                rules={[{ required: true, message: "Please select Grade Name" }]}
            >
                <Select
                    options={gradeOptions}
                    placeholder="Select Grade"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Subject Name</label>}
                name="subjectName"
                rules={[{ required: true, message: "Please select Subject Name" }]}
            >
                <Select
                    options={subjectOptions}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Batch Name</label>}
                name="batchName"
                rules={[{ required: true, message: "Please select Batch Name" }]}
            >
                <Select
                    options={batchOptions}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item
                label={<label className="block text-[#9CA3AF]">Section Name</label>}
                name="sectionName"
                rules={[{ required: true, message: "Please select Section Name" }]}
            >
                <Select
                    options={sectionOptions}
                    placeholder="Select Section"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer disabled:opacity-50"
                >
                    {submitting ? 'Enrolling...' : 'Enrol to this Course'}
                </button>
            </Form.Item>
        </Form>
    );
};

export default AssignToCourseForm;