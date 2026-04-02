import { modalType } from '@/type';
import { Form, Input, Modal, Button, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { fetchUrl } from '@/lib/fetchUrl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface BatchListModalProps extends modalType {
    editingBatch?: any;
    setEditingBatch?: (batch: any) => void;
}

const BatchListModal = ({ isOpen, setIsOpen, editingBatch, setEditingBatch }: BatchListModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
            if (editingBatch) {
                form.setFieldsValue({
                    name: editingBatch.name || '',
                    batchDetails: editingBatch.batchDetails || '',
                    batchMessage: editingBatch.batchMessage || '',
                    subjectName: editingBatch.subjectName?._id || editingBatch.subjectName || '',
                    startDate: editingBatch.startDate ? new Date(editingBatch.startDate).toISOString().split('T')[0] : '',
                    endDate: editingBatch.endDate ? new Date(editingBatch.endDate).toISOString().split('T')[0] : '',
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, editingBatch, form]);

    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const res = await fetchUrl('/subject');
            if (res?.success) {
                setSubjects(res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (setEditingBatch) setEditingBatch(null);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
            if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();

            let res;
            if (editingBatch) {
                res = await fetchUrl(`/batch/${editingBatch._id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetchUrl('/batch', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }

            if (res?.success) {
                toast.success(res.message || "Batch saved successfully");
                handleCancel();
                router.refresh(); 
            } else {
                toast.error(res?.message || "Failed to save batch");
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
            <h3 className="mb-5 text-white text-lg font-medium">{editingBatch ? 'Edit Batch' : 'Add Batch'}</h3>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Batch Name</label>}
                    name="name"
                    rules={[{ required: true, message: "Please enter Batch Name" }]}
                >
                    <Input placeholder="Batch Name" style={{ height: 45 }} />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Batch Details</label>}
                    name="batchDetails"
                    rules={[{ required: true, message: "Please enter Batch Details" }]}
                >
                    <TextArea rows={4} placeholder="Please enter Batch Details" />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Batch Msg</label>}
                    name="batchMessage"
                >
                      <TextArea rows={4} placeholder="Please enter Batch Msg" />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
                    name="subjectName"
                    rules={[{ required: true, message: "Please select a Subject" }]}
                >
                    <Select 
                        placeholder="Select a Subject" 
                        style={{ height: 45 }}
                        loading={loadingSubjects}
                        options={subjects.map(subj => ({
                            label: subj.name,
                            value: subj._id
                        }))}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Reg. Start Date</label>}
                        name="startDate"
                    >
                        <Input type="date" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Reg. End Date</label>}
                        name="endDate"
                    >
                        <Input type="date" style={{ height: 45 }} />
                    </Form.Item>
                </div>

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

export default BatchListModal;