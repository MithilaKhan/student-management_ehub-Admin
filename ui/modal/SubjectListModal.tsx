import { modalType } from '@/type';
import { Form, Input, Modal, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SubjectListModalProps extends modalType {
    editingSubject?: any;
    setEditingSubject?: (subject: any) => void;
}

const SubjectListModal = ({ isOpen, setIsOpen, editingSubject, setEditingSubject }: SubjectListModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            if (editingSubject) {
                form.setFieldsValue({
                    name: editingSubject.name,
                    details: editingSubject.details,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, editingSubject, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            let res;
            if (editingSubject) {
                // Edit existing subject
                res = await fetchUrl(`/subject/${editingSubject._id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                });
            } else {
                // Create new subject
                res = await fetchUrl('/subject', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            }

            if (res?.success) {
                toast.success(res.message || "Subject saved successfully");
                handleCancel();
                // Magic of Next.js 13+ App Router: re-fetch the server data without losing client state!
                router.refresh(); 
            } else {
                toast.error(res?.message || "Failed to save subject");
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (setEditingSubject) setEditingSubject(null);
    };

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={620}
            className="custom-black-modal"
        >
            <h3 className="mb-5 text-white text-lg font-medium">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h3>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Subject Name</label>}
                    name="name"
                    rules={[{ required: true, message: "Please enter Subject Name" }]}
                >
                    <Input placeholder="Name" style={{ height: 45 }} />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Subject Details</label>}
                    name="details"
                    rules={[{ required: true, message: "Please enter Subject Details" }]}
                >
                    <TextArea rows={4} placeholder="Please enter Subject Details" />
                </Form.Item>

                <Form.Item className="mt-6 flex justify-end">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white hover:!bg-[#14487D]"
                    >
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubjectListModal;