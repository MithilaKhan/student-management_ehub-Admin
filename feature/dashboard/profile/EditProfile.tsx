"use client";
import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';
import { useUser } from '@/app/providers/UserProvider';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const EditProfile: React.FC = () => {
    const user = useUser();
    const router = useRouter();
    const [profileForm] = Form.useForm();
    const [imgURL, setImgURL] = useState("https://i.pinimg.com/736x/7b/05/51/7b0551406cd7936252123558aacc9191.jpg");
    const [imgFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({
                name: user.name,
                email: user.email,
            });
            if (user.profile) {
                setImgURL(user.profile);
            }
        }
    }, [user, profileForm]);

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImgURL(imgUrl);
            setImageFile(file);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', values.name);

            if (imgFile) {
                formData.append('image', imgFile);
            }

            const res = await fetchUrl('/user', {
                method: 'PATCH',
                body: formData,
            });

            if (res?.success) {
                toast.success(res?.message || 'Profile updated successfully!');
                router.refresh();
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                toast.error(res?.message || 'Failed to update profile');
            }
        } catch (error: any) {
            toast.error(error?.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto text-[#ABABAB]">
            <Form 
                name="update_profile" 
                layout="vertical" 
                initialValues={{ remember: true }} 
                form={profileForm}
                onFinish={onFinish}
            >
                {/* Banner Image */}
                <div className="flex justify-center">
                    <div className="flex py-3">
                        <div className="hidden">
                            <input
                                onChange={onChange}
                                type="file"
                                id="img"
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <label
                            htmlFor="img"
                            className="relative w-[120px] h-[120px] cursor-pointer rounded-full border border-gray-600 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url(${imgURL})` }}
                        >
                            <div
                                className="absolute bottom-1 -right-1 w-10 h-10 rounded-full bg-[#1c1c1e] border border-gray-600 flex items-center justify-center shadow-lg"
                            >
                                <AiOutlineEdit size={20} className="text-white" />
                            </div>
                        </label>
                    </div>
                </div>

                <Form.Item
                    label={
                        <label htmlFor="name" className="block text-primaryText mb-1 text-white">
                            Full Name
                        </label>
                    }
                    name="name"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input className="h-12" placeholder="Enter your name" />
                </Form.Item>

                <Form.Item
                    label={
                        <label htmlFor="email" className="block text-primaryText mb-1 text-[#ABABAB]">
                            Email (Cannot be modified)
                        </label>
                    }
                    name="email"
                >
                    <Input className="h-12 bg-black/20" placeholder="Enter your email" disabled />
                </Form.Item>

                <Form.Item className="flex justify-center mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfile;