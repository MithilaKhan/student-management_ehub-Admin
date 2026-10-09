"use client";
import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { MdArrowDropDown } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Level } from "@/type";
import { fetchUrl } from "@/lib/fetchUrl";

const MarksheetForm = () => { 
    const router = useRouter();
    const [form] = Form.useForm();
    const [batches, setBatches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [batchRes, subjectRes] = await Promise.all([
                    fetchUrl('/batch'),
                    fetchUrl('/subject')
                ]);
                if (batchRes?.success) setBatches(batchRes.data || []);
                if (subjectRes?.success) setSubjects(subjectRes.data || []);
            } catch (error) {
                console.error("Failed to load filter options", error);
            }
        };
        fetchFilters();
    }, []);

    const onFinish = (values: any) => {
        const selectedSubject = subjects.find(s => s._id === values.subjectId);
        const selectedBatch = batches.find(b => b._id === values.batchId);

        const params = new URLSearchParams();
        if (values.level) params.append('level', values.level);
        if (values.subjectId) params.append('subjectId', values.subjectId);
        if (values.batchId) params.append('batchId', values.batchId);
        if (selectedSubject?.name) params.append('subjectName', selectedSubject.name);
        if (selectedBatch?.name) params.append('batchName', selectedBatch.name);

        router.push(`/exam-module/marksheet/filter-marksheet?${params.toString()}`);
    };

    return (  
        <Form form={form} layout="vertical" onFinish={onFinish} className="md:w-[50%] w-full" >
            {/* Grade */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Grade</label>}
                name="level"
                rules={[{ required: true, message: "Please select Grade" }]}
            >
                <Select
                    options={Object.values(Level).map(v => ({ label: v, value: v }))}
                    placeholder="Select Grade"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Subject */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Subject</label>}
                name="subjectId"
                rules={[{ required: true, message: "Please select Subject" }]}
            >
                <Select
                    options={subjects.map(s => ({ label: s.name, value: s._id }))}
                    placeholder="Select Subject"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Batch */}
            <Form.Item
                label={<label className="text-[#9CA3AF]">Batch</label>}
                name="batchId"
                rules={[{ required: true, message: "Please select Batch" }]}
            >
                <Select
                    options={batches.map(b => ({ label: b.name, value: b._id }))}
                    placeholder="Select Batch"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%", height: 45 }}
                    suffixIcon={<MdArrowDropDown color="white" size={22} />}
                    className="custom-dark-select"
                />
            </Form.Item>

            {/* Buttons */}
            <Form.Item className="mt-6 flex justify-end">
                <button
                    type="submit"
                    className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer"
                >
                    Get Filtered Student Marksheet
                </button>
            </Form.Item>
        </Form>
    );
};

export default MarksheetForm;
