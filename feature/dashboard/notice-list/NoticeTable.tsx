import React from "react";
import TableMain from "@/shared/TableMain";
import { FiEdit } from "react-icons/fi";
import moment from "moment";

interface NoticeTableProps {
  data: any[];
  onEdit: (record: any) => void;
}

const NoticeTable = ({ data, onEdit }: NoticeTableProps) => {
  const columns = [
    {
      title: "SL",
      key: "sl",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Notice Details",
      key: "details",
      render: (record: any) => (
        <div className="text-sm text-[#ABABAB] whitespace-pre-line">
          <div className="font-medium text-white">{record.title}</div>
          <div dangerouslySetInnerHTML={{ __html: record.description }} />
        </div>
      ),
    },
    {
      title: "Notice Duration",
      key: "duration",
      width: 250,
      render: (_: any, record: any) => (
        <div className="text-sm text-[#ABABAB]">
          <div>Start: {record.postedAt ? moment(record.postedAt).format("DD MMM YYYY, hh:mm A") : "-"}</div>
          <div className="mt-1">End: {record.expiresAt ? moment(record.expiresAt).format("DD MMM YYYY, hh:mm A") : "-"}</div>
        </div>
      ),
    },
    {
      title: "Batch",
      key: "batch",
      width: 220,
      render: (record: any) => record.batchId?.name || "-",
    },
    {
      title: "Is Active",
      key: "isActive",
      width: 100,
      render: (_: any, record: any) => {
        const isActive = new Date() < new Date(record.expiresAt);
        return isActive ? (
          <span className="text-green-400">Active</span>
        ) : (
          <span className="text-[#ABABAB]">Expired</span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: any, record: any) => (
        <button
          onClick={() => onEdit(record)}
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
        dataSource={data}
        rowKey="_id"
        pagination={{ pageSize: 15 }}
        className="w-full custom-table"
      />
    </div>
  );
};

export default NoticeTable;
