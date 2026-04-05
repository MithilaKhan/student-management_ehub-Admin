"use client";
import React from 'react';
import { Form, Select } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Level } from '@/type';

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
    const onFinish = (values: any) => {
        const params = new URLSearchParams({
            studentName: values.studentName || '',
            gradeName: values.gradeName || '',
            subjectName: values.subjectName || '',
            batchName: values.batchName || '',
            sectionName: values.sectionName || '',
        });
        router.push(`/student-list/assigned-student-list/filtered-student-list?${params.toString()}`);
    }

    const studentOptions = initialData.students?.map(item => ({ label: item.name, value: item._id })) || [];
    const subjectOptions = initialData.subjects?.map(item => ({ label: item.name, value: item._id })) || [];
    const batchOptions = initialData.batches?.map(item => ({ label: item.name, value: item._id })) || [];
    const sectionOptions = initialData.sections?.map(item => ({ label: item.name, value: item._id })) || [];
    const gradeOptions = Object.values(Level).map(level => ({ label: level, value: level }));

    return (
        <Form layout="vertical" className='md:w-[50%] w-[100%]' onFinish={onFinish}>
            <Form.Item
                label={<label className="block text-[#9CA3AF]">Student Name</label>}
                name="studentName"
                rules={[{ required: true, message: "Please select Student Name" }]}
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
                rules={[{ required: true, message: "Please enter Grade Name" }]}
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
                rules={[{ required: true, message: "Please enter Subject Name" }]}
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
                rules={[{ required: true, message: "Please enter Batch Name" }]}
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
                rules={[{ required: true, message: "Please enter Section Name" }]}
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
                <button type="submit" className=" bg-[#1A5FA4] h-[45px]  px-8 rounded-md text-white">
                  Enrol to this Course
                </button>
            </Form.Item>
        </Form>
    );
};

export default AssignToCourseForm;