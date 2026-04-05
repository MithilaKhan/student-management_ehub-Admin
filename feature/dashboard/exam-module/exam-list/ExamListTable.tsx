"use client";
import React from "react";
import TableMain from "@/shared/TableMain";
import moment from "moment";
import { FiEdit } from "react-icons/fi";

interface ExamListTableProps {
    data: any[];
    onEdit: (record: any) => void;
}

const ExamListTable = ({ data, onEdit }: ExamListTableProps) => {

    const columns = [
        {
            title: "SL",
            key: "sl",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Exam Title",
            key: "examTitle",
            render: (record: any) => (
                <div>
                    <div className="font-medium">{record.name || "-"}</div>
                    <div className="text-xs text-gray-400">Date: {record.date ? moment(record.date).format('DD MMM YYYY') : '-'}</div>
                </div>
            )
        },
        {
            title: "Exam Type",
            dataIndex: "examType",
            key: "examType",
            render: (val: string) => val ? val.replace('_', ' ') : "-"
        },
        {
            title: "Exam Details",
            key: "examDetails",
            render: (record: any) => (
                <div className="text-sm">
                    <div>{record.details || "-"}</div>
                    <div className="text-xs text-gray-400">Duration: {record.duration} | Marks: {record.totalMarks}</div>
                </div>
            )
        },
        {
            title: "Subject Exam",
            key: "subjectExam",
            render: (record: any) => record.subjectId?.name || "-"
        },
        {
            title: "Batch Name",
            key: "batchName",
            render: (record: any) => record.batchId?.name || "-"
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <button
                    onClick={() => onEdit(record)}
                    className="text-[#FF4D4D] cursor-pointer flex items-center gap-1"
                >
                    <FiEdit size={16} /> Edit
                </button>
            ),
        },
    ];

    return (
        <div className="custom-table w-full">
            <TableMain
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                rowKey="_id"
                rowClassName="custom-table"
            />
        </div>
    );
};

export default ExamListTable;

