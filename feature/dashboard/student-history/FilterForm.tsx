"use client";
import React from 'react';
import { Form, Select } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { fetchUrl } from '@/lib/fetchUrl';

const FilterForm = ({ onFinish }: { onFinish: (id: string) => void }) => {
    const [form] = Form.useForm();
    const [students, setStudents] = React.useState<any[]>([]);

    React.useEffect(() => {
        const loadStudents = async () => {
            const res = await fetchUrl('/assigned');
            if (res.success) {
                setStudents(res.data);
            }
        };
        loadStudents();
    }, []);

    const handleReset = () => {
        form.resetFields();
    };

    const handleSubmit = (values: any) => {
        onFinish(values.studentId);
    };
    return (
        <Form form={form} layout="vertical" className=' md:w-[55%] w-full' onFinish={handleSubmit}>
            <Form.Item
                label={<label className="block   text-[#9CA3AF]">Student Name</label>}
                name="studentId"
                rules={[{ required: true, message: "Please select Student Name" }]}
            >
                <Select
                    options={students.map(s => ({ label: s.name, value: s._id }))}
                    placeholder="Select Student Name"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', height: 45 }}
                    suffixIcon={<p> <MdArrowDropDown color='white' size={22} /> </p>}
                />
            </Form.Item>
            <div className="flex justify-end gap-4 ">
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
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default FilterForm;