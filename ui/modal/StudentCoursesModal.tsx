import { modalType } from '@/type';
import { Form, Input, Modal } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchUrl } from '@/lib/fetchUrl';
import { toast } from 'react-hot-toast';
import React, { useState } from 'react';

const StudentCoursesModal = ({ 
    isOpen, 
    setIsOpen, 
    onSuccess, 
    initialData 
}: modalType & { 
    onSuccess?: () => void; 
    initialData?: any;
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const gradeName = searchParams.get('gradeName');
    const subjectName = searchParams.get('subjectName');
    const batchName = searchParams.get('batchName');
    const sectionName = searchParams.get('sectionName');

    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Split name into fullName and lastName
                const names = initialData.name ? initialData.name.split(' ') : ['', ''];
                const lastName = names.pop();
                const fullName = names.join(' ');
                
                form.setFieldsValue({
                    ...initialData,
                    fullName,
                    lastName,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                name: `${values.fullName} ${values.lastName}`,
                role: 'STUDENT',
                status: 'Waiting',
                gradeName: gradeName || '',
                subjectName: subjectName || '',
                batchName: batchName || '',
                sectionName: sectionName || '',
                // Mapping form fields to API expectations if they differ
                fathersName: values.fatherName,
                mothersName: values.motherName,
                guirdianContact: values.guardianContact, 
                guardianNumber: values.guardianContact,
            };

            const isEdit = !!initialData?._id;
            const url = isEdit ? `/assigned/${initialData._id}` : '/assigned';
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetchUrl(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.success) {
                toast.success(res.message || `Student course ${isEdit ? 'updated' : 'assigned'} successfully`);
                setIsOpen(false);
                form.resetFields();
                if (onSuccess) onSuccess();
                router.refresh();
            } else {
                toast.error(res.message || `Failed to ${isEdit ? 'update' : 'assign'} course`);
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
      <h3 className="mb-5 text-white text-lg font-medium">
        {initialData ? 'Edit Student Course' : 'Add Student Courses'}
      </h3>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4">
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
                        label={<label className="block text-sm text-[#9CA3AF]">Father's Email</label>}
                        name="fatherEmail"
                        rules={[{ type: 'email', message: 'Please enter valid email' }]}
                    >
                        <Input placeholder="Enter Father's Email" style={{ height: 45 }} />
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
                        label={<label className="block text-sm text-[#9CA3AF]">Mother's Email</label>}
                        name="motherEmail"
                        rules={[{ type: 'email', message: 'Please enter valid email' }]}
                    >
                        <Input placeholder="Enter Mother's Email" style={{ height: 45 }} />
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

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Special Fee</label>}
                        name="specialFee"
                        rules={[{ required: true, message: "Please enter Special Fee" }]}
                    >
                        <Input placeholder="Enter Special Fee" type="number" style={{ height: 45 }} />
                    </Form.Item>
                </div>

                <Form.Item className="mt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </Form.Item>
            </Form>
    </Modal>
    );
};

export default StudentCoursesModal;