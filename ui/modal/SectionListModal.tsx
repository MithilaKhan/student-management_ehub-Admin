import { modalType } from '@/type';
import { Form, Input, Modal, Select } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface SectionListModalProps extends modalType {
    selectedSection?: any;
}

const SectionListModal = ({ isOpen, setIsOpen, selectedSection }: SectionListModalProps) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            if (selectedSection) {
                form.setFieldsValue({
                    name: selectedSection.name,
                    subjectName: selectedSection.subjectName?._id || selectedSection.subjectName,
                    batchName: selectedSection.batchName?._id || selectedSection.batchName,
                    emptySeat: selectedSection.emptySeat,
                    bookedSeat: selectedSection.bookedSeat,
                    totalSeat: selectedSection.totalSeat,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, selectedSection, form]);

    const fetchDropdownData = async () => {
        setLoadingDropdowns(true);
        try {
            const [subjRes, batchRes] = await Promise.all([
                fetchUrl('/subject'),
                fetchUrl('/batch'),
            ]);
            
            if (subjRes?.success) setSubjects(subjRes.data || []);
            if (batchRes?.success) setBatches(batchRes.data || []);
        } catch (error) {
            console.error("Failed to fetch dropdown data:", error);
        } finally {
            setLoadingDropdowns(false);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                emptySeat: Number(values.emptySeat),
                bookedSeat: Number(values.bookedSeat),
                totalSeat: Number(values.totalSeat),
            };

            const url = selectedSection ? `/section/${selectedSection._id}` : '/section';
            const method = selectedSection ? 'PATCH' : 'POST';

            const res = await fetchUrl(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.success) {
                toast.success(`Section ${selectedSection ? 'updated' : 'created'} successfully`);
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(res.message || `Failed to ${selectedSection ? 'update' : 'create'} section`);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
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
                {selectedSection ? 'Edit Section' : 'Add Section'}
            </h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Section Name</label>}
                    name="name"
                    rules={[{ required: true, message: 'Please enter Section Name' }]}
                >
                    <Input placeholder="Section Name" style={{ height: 45 }} />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
                    name="subjectName"
                    rules={[{ required: true, message: 'Please select a Subject' }]}
                >
                    <Select 
                        placeholder="Select a Subject" 
                        style={{ height: 45 }}
                        loading={loadingDropdowns}
                        options={subjects.map(subj => ({
                            label: subj.name,
                            value: subj._id
                        }))}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                    label={<label className="block text-sm text-[#9CA3AF]">Batch</label>}
                    name="batchName"
                    rules={[{ required: true, message: 'Please select a Batch' }]}
                >
                    <Select 
                        placeholder="Select a Batch" 
                        style={{ height: 45 }}
                        loading={loadingDropdowns}
                        options={batches.map(batch => ({
                            label: batch.name,
                            value: batch._id
                        }))}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <div className="grid grid-cols-3 gap-4">
                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Seats Empty</label>}
                        name="emptySeat"
                        rules={[{ required: true, message: 'Enter seats empty' }]}
                    >
                        <Input type="number" placeholder="Seats Empty" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Seats Filled</label>}
                        name="bookedSeat"
                        rules={[{ required: true, message: 'Enter seats filled' }]}
                    >
                        <Input type="number" placeholder="Seats Filled" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Total Seats</label>}
                        name="totalSeat"
                        rules={[{ required: true, message: 'Enter total seats' }]}
                    >
                        <Input type="number" placeholder="Total Seats" style={{ height: 45 }} />
                    </Form.Item>
                </div>

                <Form.Item className="mt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SectionListModal;