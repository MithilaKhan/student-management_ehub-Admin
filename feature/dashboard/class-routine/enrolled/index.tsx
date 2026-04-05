"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React from 'react';
import { Form, Select } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';

interface StudentEnrolledProps {
    data: any[];
}

const StudentEnrolled = ({ data }: StudentEnrolledProps) => {

    const studentOptions = data?.map((student: any) => ({
        label: student.name,
        value: student._id,
    }));

    return (
        <div className=' w-full h-full'>
            <HeaderTitle title="Select Student" />

            <div className=" h-[60vh] ">
                <div className='flex-center w-full h-full '>
                   
                        <Form layout="vertical" className=' md:w-[50%] w-[100%]'>
                            <Form.Item
                                label={<label className="block   text-[#9CA3AF]">Student Name</label>}
                                name="studentName"
                                rules={[{ required: true, message: "Please enter Student Name" }]}
                            >
                                <Select
                                    options={studentOptions}
                                    placeholder="Select Student"
                                    showSearch
                                    optionFilterProp="label"
                                    style={{ width: '100%', height: 45 }} 
                                    suffixIcon={<p> <MdArrowDropDown color='white' size={22}/> </p>}
                                />
                            </Form.Item>
                        </Form>
                   
                </div>
            </div>
        </div>
    );
};

export default StudentEnrolled;