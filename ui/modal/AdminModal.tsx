
"use client";
import React, { useState } from 'react';
import { modalType } from '@/type';
import { Form, Input, Modal } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';

interface AdminModalProps extends modalType {
    onSuccess?: () => void;
}

const AdminModal = ({ isOpen, setIsOpen, onSuccess }: AdminModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await fetchUrl('/admin/create-admin', {
                method: 'POST',
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'ADMIN',
                }),
            });

            if (res?.success) {
                toast.success(res?.message || 'Admin created successfully!');
                form.resetFields();
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(res?.message || 'Failed to create admin');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    return (
       <Modal
            centered
            open={isOpen}
            onCancel={() => {
                form.resetFields();
                setIsOpen(false);
            }}
            footer={null}
            width={620}
            className="custom-black-modal"
        >
            <h3 className="mb-5 text-white text-lg font-medium">Add Admin</h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Full Name</label>}
                    name="name"
                    rules={[{ required: true, message: "Please enter Full Name" }]}
                >
                    <Input placeholder="Enter Name" style={{ height: 45 }} />
                </Form.Item> 

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Email</label>}
                    name="email"
                    rules={[
                        { required: true, message: "Please enter Email" },
                        { type: 'email', message: "Please enter a valid email address" },
                    ]}
                >
                    <Input placeholder="Enter Email" style={{ height: 45 }} />
                </Form.Item> 

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Password</label>}
                    name="password"
                    rules={[
                        { required: true, message: "Please enter Password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password placeholder="Enter Password" style={{ height: 45 }} />
                </Form.Item>

                <Form.Item className="mt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Submit'}
                    </button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AdminModal;