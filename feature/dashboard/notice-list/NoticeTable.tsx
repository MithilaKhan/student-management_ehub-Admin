"use client";
import React from "react";
import TableMain from "@/shared/TableMain";
import { FiEdit } from "react-icons/fi";
import { NoticeListData } from "@/constants/dashboard/notice-list-data";

const formatDateTime = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
};

const NoticeTable = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (v: number) => v ?? "-",
    },
    {
      title: "Notice Details",
      dataIndex: "details",
      key: "details",
      render: (text: string) => (
        <div className="text-sm text-[#ABABAB] whitespace-pre-line">{text}</div>
      ),
    },
    {
      title: "Notice Duration",
      key: "duration",
      dataIndex: "startDate",
      width: 250,
      render: (_: any, record: any) => (
        <div className="text-sm text-[#ABABAB]">
          <div>{formatDateTime(record.startDate)}</div>
          <div className="mt-1">{formatDateTime(record.endDate)}</div>
        </div>
      ),
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
      width: 220,
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (val: boolean) =>
        val ? (
          <span className="text-green-400">Active</span>
        ) : (
          <span className="text-[#ABABAB]">Inactive</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: any, record: any) => (
        <button
          onClick={() => setIsOpen(true)}
          className="text-red-500 hover:underline flex items-center gap-2"
        >
          <FiEdit />
          <span className="text-sm">Edit</span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <TableMain
        columns={columns}
        dataSource={NoticeListData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="w-full custom-table"
      />
    </div>
  );
};

export default NoticeTable;
