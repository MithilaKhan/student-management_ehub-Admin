"use client"
import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';
import { useUser } from '@/app/providers/UserProvider';

const EditProfile: React.FC = () => {
    const user = useUser();
    const [profileForm] = Form.useForm();
    const [imgURL, setImgURL] = useState("https://i.pinimg.com/736x/7b/05/51/7b0551406cd7936252123558aacc9191.jpg");
    const [imgFile, setImageFile] = useState<File | null>(null);

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
            setImageFile(file)
        }
    };

    return (
        <div className="max-w-lg mx-auto text-[#ABABAB]">
            <Form name="update_profile" layout="vertical" initialValues={{ remember: true }} form={profileForm}>
                {/* Banner Image */}
                <div className="flex justify-center">
                    <div className="flex  py-3">
                        <div className='hidden'>
                            <input
                                onChange={onChange}
                                type="file"
                                id="img"
                                className="hidden "
                            />
                        </div>
                        <label
                            htmlFor="img"
                            className="relative w-[120px] h-[120px] cursor-pointer rounded-full border border-gray-100  bg-cover bg-center"
                            style={{ backgroundImage: `url(${imgURL})` }}
                        >
                            <div
                                className="absolute bottom-1 -right-1 w-10 h-10 rounded-full bg-[#1c1c1e] border border-gray-600 flex items-center justify-center"
                            >
                                <AiOutlineEdit size={20} className="text-white" />
                            </div>
                        </label>
                    </div>
                </div>

                <Form.Item
                    label={
                        <label htmlFor="name" className="block text-primaryText mb-1 ">
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
                        <label htmlFor="email" className="block text-primaryText mb-1 ">
                            Email
                        </label>
                    }
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input className="h-12" placeholder="Enter your email" readOnly />
                </Form.Item>

                <Form.Item className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white"
                    >
                        Save Changes
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfile;