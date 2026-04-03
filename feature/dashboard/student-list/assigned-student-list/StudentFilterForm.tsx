"use client";
import React from 'react';
import { Form, Select } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Level } from '@/type';
import { fetchUrl } from '@/lib/fetchUrl';

const StudentFilterForm = () => {  
    const router = useRouter();
    const [subjects, setSubjects] = React.useState<any[]>([]);
    const [batches, setBatches] = React.useState<any[]>([]);
    const [sections, setSections] = React.useState<any[]>([]);

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const [subRes, batRes, secRes] = await Promise.all([
                    fetchUrl('/subject'),
                    fetchUrl('/batch'),
                    fetchUrl('/section')
                ]);
                if (subRes?.success) setSubjects(subRes.data);
                if (batRes?.success) setBatches(batRes.data);
                if (secRes?.success) setSections(secRes.data);
            } catch (err) {
                console.error("Filter options fetch error:", err);
            }
        };
        loadOptions();
    }, []);

    const onFinish = (values: any) => {
        const params = new URLSearchParams({
            gradeName: values.gradeName || '',
            subjectName: values.subjectName || '',
            batchName: values.batchName || '',
            sectionName: values.sectionName || '',
        });
        router.push(`/student-list/assigned-student-list/filtered-student-list?${params.toString()}`);
    }
    return (
        <Form layout="vertical" className=' md:w-[50%] w-[100%]' onFinish={onFinish}>
            <Form.Item
                label={<label className="block   text-[#9CA3AF]">Grade Name</label>}
                name="gradeName"
                rules={[{ required: true, message: "Please enter Grade Name" }]}
            >
                <Select
                    options={Object.values(Level).map(level => ({ label: level, value: level }))}
                    placeholder="Select Grade"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>
            <Form.Item
                label={<label className="block   text-[#9CA3AF]">Subject Name</label>}
                name="subjectName"
                rules={[{ required: true, message: "Please enter Subject Name" }]}
            >
                <Select
                    options={subjects.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>
            <Form.Item
                label={<label className="block   text-[#9CA3AF]">Batch Name</label>}
                name="batchName"
                rules={[{ required: true, message: "Please enter Batch Name" }]}
            >
                <Select
                    options={batches.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>
            <Form.Item
                label={<label className="block   text-[#9CA3AF]">Section Name</label>}
                name="sectionName"
                rules={[{ required: true, message: "Please enter Section Name" }]}
            >
                <Select
                    options={sections.map(item => ({ label: item.name, value: item._id }))}
                    placeholder="Select Section"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>

            <Form.Item className="mt-6 flex justify-end">
                <button type="submit" className=" bg-[#1A5FA4] h-[45px]  px-8 rounded-md text-white">
                   Get Filtered Student List
                </button>
            </Form.Item>
        </Form>
    );
};

export default StudentFilterForm;