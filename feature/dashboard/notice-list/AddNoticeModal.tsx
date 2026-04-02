"use client";

import { modalType } from "@/type";
import { Button, Form, Modal, Select, DatePicker } from "antd";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddNoticeModal = ({ isOpen, setIsOpen }: modalType) => {
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [description, setDescription] = useState("");

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

  const batchOptions = [
    { label: "Select Batch", value: "" },
    {
      label: "IAL AS Physics May 2025 B#1&2",
      value: "IAL-AS-Physics-2025-B1B2",
    },
    { label: "IGCSE Math May 2025", value: "IGCSE-Math-2025" },
  ];

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      description,
    };
    console.log("Add notice payload:", payload);
    form.resetFields();
    setDescription("");
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      width={560}
      footer={false}
      centered
      className="custom-black-modal"
    >
      <h3 className="mb-2 text-white text-lg font-medium">Add Notice</h3>
      <Form id="planForm" form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Batch"
          name="batch"
          rules={[{ required: true, message: "Please select Batch" }]}
        >
          <Select
            options={batchOptions}
            placeholder="Select Batch"
            style={{ height: 45, border: "none" }}
          />
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="startDate"
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
          label="End Time"
          name="endDate"
          rules={[{ required: true, message: "Please select end time" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%", height: 45 }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select end date & time"
          />
        </Form.Item>

        <Form.Item label="Description" required>
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
            className=" bg-[#1A5FA4] h-[45px]  px-8 rounded-md text-white"
          >
            Save Changes
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNoticeModal;
