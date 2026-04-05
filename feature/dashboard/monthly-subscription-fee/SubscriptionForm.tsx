"use client";
import React from 'react';
import { DatePicker, Form } from 'antd';
import { IoCalendarOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const SubscriptionForm = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = (values: any) => {
        const month = values.month ? (values.month.month() + 1) : '';
        const year = values.year ? values.year.year() : '';
        
        if (month && year) {
            router.push(`/monthly-subscription-fee?month=${month}&year=${year}`);
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            className="md:w-[80%] w-full"
            onFinish={onFinish}
        >
            <div className="grid grid-cols-2 gap-x-4">
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Select Month</label>}
                    name="month"
                    rules={[{ required: true, message: 'Please select Month' }]}
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
                    rules={[{ required: true, message: 'Please select Year' }]}
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

export default SubscriptionForm;