"use client";

import { modalType } from "@/type";
import { Button, Form, Modal, Select, Input, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { fetchUrl } from "@/lib/fetchUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface OverviewModalProps extends modalType {
    selectedRoutine?: any;
}

const DAYS_OF_WEEK = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
];

const OverviewModal = ({ isOpen, setIsOpen, selectedRoutine }: OverviewModalProps) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [subjects, setSubjects] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            if (selectedRoutine) {
                // Map the parallel arrays into array of objects for Form.List
                const schedules = (selectedRoutine.day || []).map((d: string, index: number) => {
                    const st = selectedRoutine.startTime[index];
                    const et = selectedRoutine.endTime[index];
                    return {
                        day: d,
                        startTime: st ? dayjs(st, "hh:mm A") : null,
                        endTime: et ? dayjs(et, "hh:mm A") : null,
                    };
                });

                form.setFieldsValue({
                    name: selectedRoutine.name,
                    subjectName: selectedRoutine.subjectName?._id || selectedRoutine.subjectName,
                    batchName: selectedRoutine.batchName?._id || selectedRoutine.batchName,
                    section: selectedRoutine.section?._id || selectedRoutine.section,
                    location: selectedRoutine.location,
                    schedules: schedules.length > 0 ? schedules : [{}],
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ schedules: [{}] });
            }
        }
    }, [isOpen, selectedRoutine, form]);

    const fetchDropdownData = async () => {
        setLoadingDropdowns(true);
        try {
            const [subjRes, batchRes, secRes] = await Promise.all([
                fetchUrl('/subject'),
                fetchUrl('/batch'),
                fetchUrl('/section'),
            ]);
            
            if (subjRes?.success) setSubjects(subjRes.data || []);
            if (batchRes?.success) setBatches(batchRes.data || []);
            if (secRes?.success) setSections(secRes.data || []);
        } catch (error) {
            console.error("Failed to fetch dropdown data:", error);
        } finally {
            setLoadingDropdowns(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const schedules = values.schedules || [];
            const day = schedules.map((s: any) => s.day).filter(Boolean);
            const startTime = schedules.map((s: any) => s.startTime ? s.startTime.format("hh:mm A") : "").filter(Boolean);
            const endTime = schedules.map((s: any) => s.endTime ? s.endTime.format("hh:mm A") : "").filter(Boolean);

            const payload = {
                name: values.name,
                subjectName: values.subjectName,
                batchName: values.batchName,
                section: values.section,
                location: values.location,
                day,
                startTime,
                endTime
            };

            const url = selectedRoutine ? `/routine/${selectedRoutine._id}` : '/routine';
            const method = selectedRoutine ? 'PATCH' : 'POST';

            const res = await fetchUrl(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.success) {
                toast.success(`Routine ${selectedRoutine ? 'updated' : 'created'} successfully`);
                handleCancel();
                router.refresh();
            } else {
                toast.error(res.message || `Failed to ${selectedRoutine ? 'update' : 'create'} routine`);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            width={700} 
            footer={false}
            centered 
            className="custom-black-modal"
        > 
            <h3 className="mb-5 text-white text-lg font-medium">{selectedRoutine ? 'Edit Routine' : 'Add Routine'}</h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Routine Name</label>}
                        name="name"
                        rules={[{ required: true, message: "Please enter Routine Name" }]}
                    >
                        <Input placeholder="Routine Name" style={{ height: 45 }} />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Location/Room</label>}
                        name="location"
                        rules={[{ required: true, message: "Please enter Location" }]}
                    >
                        <Input placeholder="Room 305" style={{ height: 45 }} />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
                        name="subjectName"
                    >
                        <Select 
                            placeholder="Select Subject" 
                            style={{ height: 45 }}
                            loading={loadingDropdowns}
                            options={subjects.map(s => ({ label: s.name, value: s._id }))}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Batch</label>}
                        name="batchName"
                    >
                        <Select 
                            placeholder="Select Batch" 
                            style={{ height: 45 }}
                            loading={loadingDropdowns}
                            options={batches.map(b => ({ label: b.name, value: b._id }))}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<label className="block text-sm text-[#9CA3AF]">Section</label>}
                        name="section"
                    >
                        <Select 
                            placeholder="Select Section" 
                            style={{ height: 45 }}
                            loading={loadingDropdowns}
                            options={sections.map(s => ({ label: s.name, value: s._id }))}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>
                </div>

                <div className="mb-2">
                    <label className="block text-sm text-[#9CA3AF] mb-3">Schedules</label>
                    <Form.List name="schedules">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex gap-4 items-center mb-3">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'day']}
                                            className="mb-0 flex-1"
                                            rules={[{ required: true, message: 'Missing day' }]}
                                        >
                                            <Select 
                                                placeholder="Select Day" 
                                                options={DAYS_OF_WEEK} 
                                                style={{ height: 45 }}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'startTime']}
                                            className="mb-0 flex-1"
                                            rules={[{ required: true, message: 'Missing start time' }]}
                                        >
                                            <TimePicker 
                                                use12Hours 
                                                format="hh:mm A" 
                                                placeholder="Start Time" 
                                                style={{ height: 45, width: '100%' }} 
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'endTime']}
                                            className="mb-0 flex-1"
                                            rules={[{ required: true, message: 'Missing end time' }]}
                                        >
                                            <TimePicker 
                                                use12Hours 
                                                format="hh:mm A" 
                                                placeholder="End Time" 
                                                style={{ height: 45, width: '100%' }} 
                                            />
                                        </Form.Item>

                                        {fields.length > 1 ? (
                                            <button 
                                                type="button"
                                                onClick={() => remove(name)}
                                                className="text-[#FF4D4D] hover:text-red-500 mt-1"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        ) : (
                                            <div className="w-[20px]"></div>
                                        )}
                                    </div>
                                ))}
                                <Button 
                                    type="dashed" 
                                    onClick={() => add()} 
                                    block 
                                    icon={<FiPlus />}
                                    className="h-[45px] text-[#9CA3AF] border-[#4b5563] hover:text-white hover:border-[#9ca3af]"
                                >
                                    Add Another Slot
                                </Button>
                            </>
                        )}
                    </Form.List>
                </div>

                <Form.Item className="mt-8 flex justify-end">
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

export default OverviewModal;