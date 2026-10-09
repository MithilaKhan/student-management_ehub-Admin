"use client";
import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await fetchUrl('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                }),
            });

            if (res?.success) {
                toast.success(res?.message || 'Password changed successfully!');
                form.resetFields();
            } else {
                toast.error(res?.message || 'Failed to change password');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-0 lg:px-12 mt-8">
            <Form
                form={form}
                layout="vertical"
                initialValues={{ remember: true }}
                className="w-full lg:w-1/2"
                onFinish={onFinish}
            >
                <Form.Item
                    label={
                        <label className="block text-primaryText mb-1 text-white">
                            Current Password
                        </label>
                    }
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please input Current password!' }]}
                >
                    <Input.Password className="h-12 px-4" placeholder="Enter current password" />
                </Form.Item>
                <Form.Item
                    label={
                        <label className="block text-primaryText mb-1 text-white">
                            New Password
                        </label>
                    }
                    name="newPassword"
                    dependencies={['currentPassword']}
                    rules={[
                        {
                            required: true,
                            message: "Please input your New password!",
                        },
                        {
                            min: 6,
                            message: "Password must be at least 6 characters long!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('currentPassword') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('New password must be different from current password'));
                            },
                        }),
                    ]}
                >
                    <Input.Password className="h-12 px-4" placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                    label={
                        <label className="block text-primaryText mb-1 text-white">
                            Confirm Password
                        </label>
                    }
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        {
                            required: true,
                            message: "Please input your Confirm password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password className="h-12 px-4" placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Changing Password...' : 'Save Changes'}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;