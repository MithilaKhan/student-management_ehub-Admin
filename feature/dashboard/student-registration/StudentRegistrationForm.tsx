"use client";
import React from 'react';
import { DatePicker, Form, Input } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { toast } from 'react-hot-toast';

const StudentRegistrationForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                name: `${values.fullName} ${values.lastName}`,
                role: 'STUDENT',
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
            };
            
            // Remove confirmPassword from payload
            delete payload.confirmPassword;

            const res = await fetchUrl('/user/staff', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (res.success) {
                toast.success(res.message || 'Student registered successfully');
                form.resetFields();
            } else {
                toast.error(res.message || 'Failed to register student');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
         <Form form={form} layout="vertical" className="w-full" onFinish={onFinish}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Full Name</label>}
          name="fullName"
          rules={[{ required: true, message: 'Please enter Full Name' }]}
        >
          <Input placeholder="Enter Full Name" style={{ height: 45 }} />
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
          rules={[{ required: true, message: 'Please enter E-mail' }, { type: 'email', message: 'Enter a valid email' }]}
        >
          <Input placeholder="Enter E-mail" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Address</label>}
          name="address"
        >
          <Input placeholder="Enter Address" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Phone Number</label>}
          name="phoneNumber"
        >
          <Input placeholder="Enter Phone Number" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Mobile Number</label>}
          name="mobileNumber"
        >
          <Input placeholder="Enter Mobile Number" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Student's Contact</label>}
          name="studentContact"
        >
          <Input placeholder="Enter Student's Contact" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Father's Name</label>}
          name="fatherName"
        >
          <Input placeholder="Enter Father's Name" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Father's Contact</label>}
          name="fatherContact"
        >
          <Input placeholder="Enter Father's Contact" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Father's Email</label>}
          name="fatherEmail"
          rules={[{ type: 'email', message: 'Please enter valid email' }]}
        >
          <Input placeholder="Enter Father's Email" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Mother's Name</label>}
          name="motherName"
        >
          <Input placeholder="Enter Mother's Name" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Mother's Contact</label>}
          name="motherContact"
        >
          <Input placeholder="Enter Mother's Contact" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Mother's Email</label>}
          name="motherEmail"
          rules={[{ type: 'email', message: 'Please enter valid email' }]}
        >
          <Input placeholder="Enter Mother's Email" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Guardian Name</label>}
          name="guardianName"
        >
          <Input placeholder="Enter Guardian's Name" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Guardian's Contact</label>}
          name="guardianContact"
        >
          <Input placeholder="Enter Guardian's Contact" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Date Of Birth</label>}
          name="dateOfBirth"
        >
          <DatePicker placeholder="mm/dd/yyyy" style={{ width: '100%', height: 45 }} format="MM/DD/YYYY" />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Passport/Birth Certificate No.</label>}
          name="passportNo"
        >
          <Input placeholder="Enter Passport/Birth Certificate No." style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Password</label>}
          name="password"
          rules={[{ required: true, message: 'Please enter Password' }]}
          extra={<div className="text-xs text-[#FBBF24] mt-1">*min 8 character required</div>}
        >
          <Input.Password placeholder="Enter Password" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label={<label className="block text-sm text-[#9CA3AF]">Confirm Password</label>}
          name="confirmPassword"
          dependencies={['password']}
          extra={<div className="text-xs text-[#FBBF24] mt-1">*min 8 character required</div>}
          rules={[
            { required: true, message: 'Please confirm Password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Enter Confirm Password" style={{ height: 45 }} />
        </Form.Item>
      </div>

      <Form.Item className="mt-6 flex justify-end">
        <button 
            type="submit" 
            disabled={loading}
            className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </Form.Item>
    </Form>
    );
};

export default StudentRegistrationForm;