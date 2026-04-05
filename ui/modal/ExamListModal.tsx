"use client";
import React, { useEffect, useState } from "react";
import { modalType } from "@/type";
import { Form, Input, Modal, Select, DatePicker } from "antd";
import { MdArrowDropDown } from "react-icons/md";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Level } from "@/type";
import { useRouter } from "next/navigation";

interface ExamListModalProps extends modalType {
  initialData?: any;
}

const ExamTypes = [
  "CLASSTEST", "MONTHLY_TEST", "DAILY_TEST", "CHAPTER_TEST", 
  "QUIZ", "MOCK_TEST", "ASSIGNMENT", "PROJECT"
].map(type => ({ label: type.replace('_', ' '), value: type }));

const ScoreFormats = [
  { label: "MARK", value: "MARK" },
  { label: "PERCENTAGE", value: "PERCENTAGE" }
];

const ExamListModal = ({ isOpen, setIsOpen, initialData }: ExamListModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, batchRes] = await Promise.all([
          fetchUrl('/subject'),
          fetchUrl('/batch')
        ]);
        if (subjectRes?.success) setSubjects(subjectRes.data);
        if (batchRes?.success) setBatches(batchRes.data);
      } catch (error) {
        console.error("Failed to fetch subjects/batches", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          subjectId: initialData.subjectId?._id || initialData.subjectId,
          batchId: initialData.batchId?._id || initialData.batchId,
          details: initialData.details,
          grade: initialData.grade,
          date: initialData.date ? dayjs(initialData.date) : undefined,
          duration: initialData.duration,
          numberOfPaperSets: initialData.numberOfPaperSets,
          totalMarks: initialData.totalMarks,
          examType: initialData.examType,
          scoreFormat: initialData.scoreFormat,
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
        duration: Number(values.duration),
        numberOfPaperSets: Number(values.numberOfPaperSets),
        totalMarks: Number(values.totalMarks),
        date: values.date ? values.date.toISOString() : undefined,
      };

      const isEdit = !!initialData?._id;
      const url = isEdit ? `/exam/${initialData._id}` : '/exam';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetchUrl(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.success) {
        toast.success(`Exam ${isEdit ? "updated" : "added"} successfully`);
        form.resetFields();
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || `Failed to ${isEdit ? "update" : "add"} exam`);
      }
    } catch (error: any) {
      toast.error("An error occurred");
      console.error(error);
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
      width={720}
      className="custom-black-modal"
    >
      <h3 className="mb-5 text-white text-lg font-medium">
        {initialData ? "Edit Exam" : "Add Exam"}
      </h3>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4">
          <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Exam Name</label>}
            name="name"
            rules={[{ required: true, message: "Please enter Exam Name" }]}
          >
            <Input placeholder="Enter Exam Name" style={{ height: 45 }} />
          </Form.Item>

          <Form.Item
             label={<label className="block text-sm text-[#9CA3AF]">Exam Type</label>}
             name="examType"
             rules={[{ required: true, message: "Please select Exam Type" }]}
          >
            <Select
              options={ExamTypes}
              placeholder="Select Exam Type"
              style={{ width: '100%', height: 45 }}
              suffixIcon={<MdArrowDropDown color='white' size={22} />}
            />
          </Form.Item>

          <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Grade</label>}
            name="grade"
            rules={[{ required: true, message: "Please select Grade" }]}
          >
             <Select
                options={Object.values(Level).map(level => ({ label: level, value: level }))}
                placeholder="Select Grade"
                style={{ width: '100%', height: 45 }}
                suffixIcon={<MdArrowDropDown color='white' size={22} />}
             />
          </Form.Item>

          <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Subject</label>}
            name="subjectId"
            rules={[{ required: true, message: "Please select Subject" }]}
          >
            <Select
              options={subjects.map(s => ({ label: s.name, value: s._id }))}
              placeholder="Select Subject"
              style={{ width: '100%', height: 45 }}
              suffixIcon={<MdArrowDropDown color='white' size={22} />}
            />
          </Form.Item>

          <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Batch Name</label>}
            name="batchId"
            rules={[{ required: true, message: "Please select Batch Name" }]}
          >
            <Select
              options={batches.map(b => ({ label: b.name, value: b._id }))}
              placeholder="Select Batch Name"
              style={{ width: '100%', height: 45 }}
              suffixIcon={<MdArrowDropDown color='white' size={22} />}
            />
          </Form.Item>

          <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Date</label>}
            name="date"
            rules={[{ required: true, message: "Please select Date" }]}
          >
            <DatePicker
              style={{ width: '100%', height: 45 }}
              format="YYYY-MM-DD"
              placeholder="Select date"
            />
          </Form.Item>

          <Form.Item
             label={<label className="block text-sm text-[#9CA3AF]">Duration (mins)</label>}
             name="duration"
             rules={[{ required: true, message: "Please enter duration" }]}
          >
             <Input type="number" placeholder="Enter duration in minutes" style={{ height: 45 }} />
          </Form.Item>

          <Form.Item
             label={<label className="block text-sm text-[#9CA3AF]">Total Marks</label>}
             name="totalMarks"
             rules={[{ required: true, message: "Please enter total marks" }]}
          >
             <Input type="number" placeholder="Enter total marks" style={{ height: 45 }} />
          </Form.Item>

          <Form.Item
             label={<label className="block text-sm text-[#9CA3AF]">Number of Paper Sets</label>}
             name="numberOfPaperSets"
             rules={[{ required: true, message: "Please enter number of paper sets" }]}
          >
             <Input type="number" placeholder="Enter number of sets" style={{ height: 45 }} />
          </Form.Item>

          <Form.Item
             label={<label className="block text-sm text-[#9CA3AF]">Score Format</label>}
             name="scoreFormat"
             rules={[{ required: true, message: "Please select Score Format" }]}
          >
            <Select
              options={ScoreFormats}
              placeholder="Select Score Format"
              style={{ width: '100%', height: 45 }}
              suffixIcon={<MdArrowDropDown color='white' size={22} />}
            />
          </Form.Item>
        </div>

        <Form.Item
            label={<label className="block text-sm text-[#9CA3AF]">Exam Details</label>}
            name="details"
        >
          <Input.TextArea placeholder="Enter details" rows={4} />
        </Form.Item>

        <Form.Item className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExamListModal;
