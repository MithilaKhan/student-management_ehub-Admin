"use client";

import { modalType } from "@/type";
import { Button, Form, Modal, Select, DatePicker, Input } from "antd";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface AddNoticeModalProps extends modalType {
  initialData?: any;
}

const AddNoticeModal = ({ isOpen, setIsOpen, initialData }: AddNoticeModalProps) => {
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [description, setDescription] = useState("");
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joditConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write description...",
      toolbarAdaptive: false,
      toolbarSticky: true,
      height: 370,
      uploader: { insertImageAsBase64URI: true },
      theme: "dark",
    }),
    [],
  );

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetchUrl('/batch');
        if (res.success) {
          setBatches(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch batches", error);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          title: initialData.title,
          audience: initialData.audience,
          batchId: initialData.batchId?._id || initialData.batchId,
          postedAt: initialData.postedAt ? dayjs(initialData.postedAt) : undefined,
          expiresAt: initialData.expiresAt ? dayjs(initialData.expiresAt) : undefined,
        });
        setDescription(initialData.description || "");
      } else {
        form.resetFields();
        setDescription("");
      }
    }
  }, [isOpen, initialData, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        description,
        postedAt: values.postedAt ? values.postedAt.toISOString() : undefined,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : undefined,
      };

      const isEdit = !!initialData?._id;
      const url = isEdit ? `/notice/${initialData._id}` : '/notice';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetchUrl(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.success) {
        toast.success(`Notice ${isEdit ? "updated" : "added"} successfully`);
        form.resetFields();
        setDescription("");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || `Failed to ${isEdit ? "update" : "add"} notice`);
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
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      width={720}
      footer={false}
      centered
      className="custom-black-modal"
    >
      <h3 className="mb-2 text-white text-lg font-medium">
        {initialData ? "Edit Notice" : "Add Notice"}
      </h3>
      <Form id="planForm" form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<label className="text-white">Title</label>}
          name="title"
          rules={[{ required: true, message: "Please enter notice title" }]}
        >
          <Input placeholder="Enter notice title" style={{ height: 45 }} />
        </Form.Item>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4">
          <Form.Item
            label={<label className="text-white">Audience</label>}
            name="audience"
            rules={[{ required: true, message: "Please select an audience" }]}
          >
            <Select
              options={[
                { label: 'ALL', value: 'ALL' },
                { label: 'STUDENTS', value: 'STUDENTS' },
                { label: 'TEACHERS', value: 'TEACHERS' },
                { label: 'STAFF', value: 'STAFF' },
              ]}
              placeholder="Select Audience"
              style={{ height: 45, border: "none" }}
            />
          </Form.Item>

          <Form.Item
            label={<label className="text-white">Batch</label>}
            name="batchId"
            rules={[{ required: true, message: "Please select a Batch" }]}
          >
            <Select
              options={batches.map(b => ({ label: b.name, value: b._id }))}
              placeholder="Select Batch"
              style={{ height: 45, border: "none" }}
            />
          </Form.Item>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4">
          <Form.Item
            label={<label className="text-white">Start Time</label>}
            name="postedAt"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%", height: 45 }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select start date & time"
            />
          </Form.Item>

          <Form.Item
            label={<label className="text-white">End Time</label>}
            name="expiresAt"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%", height: 45 }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select end date & time"
            />
          </Form.Item>
        </div>

        <Form.Item label={<label className="text-white">Description</label>} required>
          <div className="border border-gray-300 rounded-md">
            {/* @ts-ignore */}
            <JoditEditor
              ref={editorRef}
              value={description}
              config={joditConfig}
              onChange={(v) => setDescription(v)}
            />
          </div>
        </Form.Item>
        <Form.Item className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className=" bg-[#1A5FA4] h-[45px] px-8 rounded-md text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNoticeModal;
