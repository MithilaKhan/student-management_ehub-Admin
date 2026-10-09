"use client";
import React, { useEffect, useState } from "react";
import { Form, Select, Checkbox } from "antd";
import { MdArrowDropDown } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Level } from "@/type";
import { fetchUrl } from "@/lib/fetchUrl";

const SMSExamMarkForm = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [subRes, batchRes, secRes, examRes] = await Promise.all([
                    fetchUrl('/subject'),
                    fetchUrl('/batch'),
                    fetchUrl('/section'),
                    fetchUrl('/exam'),
                ]);
                if (subRes?.success) setSubjects(subRes.data || []);
                if (batchRes?.success) setBatches(batchRes.data || []);
                if (secRes?.success) setSections(secRes.data || []);
                if (examRes?.success) setExams(examRes.data || []);
            } catch (err) {
                console.error("Failed to load SMS exam mark filter data", err);
            }
        };
        fetchFilters();
    }, []);

    const onFinish = (values: any) => {
        const params = new URLSearchParams();
        if (values.level) params.append('level', values.level);
        if (values.subjectId) params.append('subjectId', values.subjectId);
        if (values.batchId) params.append('batchId', values.batchId);
        if (values.sectionId) params.append('sectionId', values.sectionId);
        if (values.examId) params.append('examId', values.examId);
        if (values.sendContacts?.length) {
            params.append('sendContacts', values.sendContacts.join(','));
        }

        router.push(`/exam-module/marks-entry?${params.toString()}`);
    };

    return (
        <div className="flex md:flex-row flex-col-reverse justify-between h-full ">
            {/* Left side form */} 
            <div className=" md:w-[75%] w-full"> 
            <Form form={form} layout="vertical" onFinish={onFinish} className="md:w-[70%] w-full bg-transparent">
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

                {/* Section */}
                <Form.Item
                    label={<label className="text-[#9CA3AF]">Section Name</label>}
                    name="sectionId"
                    rules={[{ required: true, message: "Please select Section" }]}
                >
                    <Select
                        options={sections.map(sec => ({ label: sec.name, value: sec._id }))}
                        placeholder="Select Section Name"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: "100%", height: 45 }}
                        suffixIcon={<MdArrowDropDown color="white" size={22} />}
                        className="custom-dark-select"
                    />
                </Form.Item>

                {/* Exam Title */}
                <Form.Item
                    label={<label className="text-[#9CA3AF]">Exam Title</label>}
                    name="examId"
                >
                    <Select
                        options={exams.map(e => ({ label: e.name || e.title, value: e._id }))}
                        placeholder="Select Exam (Optional)"
                        showSearch
                        optionFilterProp="label"
                        allowClear
                        style={{ width: "100%", height: 45 }}
                        suffixIcon={<MdArrowDropDown color="white" size={22} />}
                        className="custom-dark-select"
                    />
                </Form.Item>

                {/* Checkboxes */}
                <Form.Item
                    name="sendContacts"
                    label={<span className="text-[#9CA3AF]">Send SMS to the contacts</span>}
                    initialValue={['father']}
                >
                    <Checkbox.Group className="flex md:flex-row flex-wrap gap-6 text-white">
                        <Checkbox value="father" className="text-white">Father’s Contact</Checkbox>
                        <Checkbox value="mother" className="text-white">Mother’s Contact</Checkbox>
                        <Checkbox value="guardian" className="text-white">Guardian’s Contact</Checkbox>
                        <Checkbox value="student" className="text-white">Student’s Contact</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {/* Buttons */}
                <Form.Item className="mt-6 flex justify-end">
                    <button type="submit" className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors h-[45px] px-8 rounded-md text-white font-medium cursor-pointer">
                        Submit
                    </button>
                </Form.Item>
            </Form>
            </div>

            {/* Right side guide */}
            <div className="md:w-[25%] w-full md:pb-0 pb-6 ">
                <h2 className="text-[#F1F1F1] text-xl font-medium mb-3 underline underline-offset-4">How to input Marks</h2>
                <ul className="space-y-3 text-sm">
                    <li className="text-[#F1F1F1]">
                        <strong className="text-[#FF3333]">** Input 0-Any number:</strong> Means It will be sent as mark.
                    </li>
                    <li className="text-[#F1F1F1]">
                        <strong className="text-[#FF3333]">** Input No number:</strong> Means student didn't appear the exam.
                    </li>
                    <li className="text-[#F1F1F1]">
                        <strong className="text-[#FF3333]">** Input -1:</strong> Means while sending mark through sms this student or their parents won't get SMS.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SMSExamMarkForm;
