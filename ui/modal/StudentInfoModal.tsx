"use client";
import { modalType } from '@/type';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { fetchUrl } from '@/lib/fetchUrl';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const StudentInfoModal = ({ isOpen, setIsOpen }: modalType) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                name: `${values.firstName} ${values.lastName}`,
                role: 'STUDENT',
                password: '00000000', // Default password as per screenshot
            };

            // Remove firstName and lastName from payload
            delete payload.firstName;
            delete payload.lastName;

            const res = await fetchUrl('/user/staff', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (res.success) {
                toast.success(res.message || 'Student added successfully');
                router.refresh();
                form.resetFields();
                setIsOpen(false);
            } else {
                toast.error(res.message || 'Failed to add student');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            width={620}
            className="custom-black-modal"
        >
            <h3 className="mb-5 text-white text-lg font-medium">Add Student Info</h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid grid-cols-2 gap-x-4">
                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">First Name</label>}
                        name="firstName"
                        rules={[{ required: true, message: 'Please enter First Name' }]}
                    >
                        <Input placeholder="Enter First Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Last Name</label>}
                        name="lastName"
                        rules={[{ required: true, message: 'Please enter Last Name' }]}
                    >
                        <Input placeholder="Enter Last Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">E-mail</label>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter Email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input placeholder="Enter E-mail" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Address</label>}
                        name="address"
                        rules={[{ required: true, message: 'Please enter Address' }]}
                    >
                        <Input placeholder="Enter Address" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Phone Number</label>}
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Please enter Phone Number' }]}
                    >
                        <Input placeholder="Enter Phone Number" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Mobile Number</label>}
                        name="mobileNumber"
                        rules={[{ required: true, message: 'Please enter Mobile Number' }]}
                    >
                        <Input placeholder="Enter Mobile Number" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Father's Name</label>}
                        name="fatherName"
                        rules={[{ required: true, message: "Please enter Father's Name" }]}
                    >
                        <Input placeholder="Enter Father's Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Father's Contact</label>}
                        name="fatherContact"
                        rules={[{ required: true, message: "Please enter Father's Contact" }]}
                    >
                        <Input placeholder="Enter Father's Contact" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Mother's Name</label>}
                        name="motherName"
                        rules={[{ required: true, message: "Please enter Mother's Name" }]}
                    >
                        <Input placeholder="Enter Mother's Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Mother's Contact</label>}
                        name="motherContact"
                        rules={[{ required: true, message: "Please enter Mother's Contact" }]}
                    >
                        <Input placeholder="Enter Mother's Contact" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Guardian Name</label>}
                        name="guardianName"
                        rules={[{ required: true, message: "Please enter Guardian's Name" }]}
                    >
                        <Input placeholder="Enter Guardian's Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Guardian's Contact</label>}
                        name="guardianContact"
                        rules={[{ required: true, message: "Please enter Guardian's Contact" }]}
                    >
                        <Input placeholder="Enter Guardian's Contact" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Date of Birth</label>}
                        name="dateOfBirth"
                        rules={[{ required: true, message: "Please enter Date of Birth" }]}
                    >
                        <Input type="date" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Passport Number</label>}
                        name="passportNumber"
                        rules={[{ required: true, message: "Please enter Passport Number" }]}
                    >
                        <Input placeholder="Enter Passport Number" style={{ height: 45 }} />
                    </Form.Item>
                </div>

                <Form.Item className="mt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Save Changes'}
                    </button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StudentInfoModal;