"use client";
import React from "react";
import TableMain from "@/shared/TableMain";
import moment from "moment";
import { useRouter } from "next/navigation";

interface MarksEntryTableProps {
    data: any[];
}

const MarksEntryTable = ({ data }: MarksEntryTableProps) => {
    const router = useRouter();

    const columns = [
        {
            title: "SL",
            key: "sl",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Exam Name",
            key: "examName",
            render: (record: any) => (
                <div>
                    <div className="font-medium text-white">{record.examId?.name || "-"}</div>
                    <div className="text-xs text-gray-400">Type: {record.examId?.examType?.replace('_', ' ') || "-"}</div>
                </div>
            )
        },
        {
            title: "Subject",
            key: "subject",
            render: (record: any) => record.subjectId?.name || "-"
        },
        {
            title: "Date",
            key: "date",
            render: (record: any) => record.examId?.date ? moment(record.examId.date).format('DD MMM YYYY') : "-"
        },
        {
            title: "Total Marks",
            key: "totalMarks",
            render: (record: any) => record.examId?.totalMarks || "-"
        },
        {
            title: "Format",
            key: "format",
            render: (record: any) => record.examId?.scoreFormat || "-"
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <button
                    onClick={() => router.push(`/exam-module/marks-entry/${record._id}`)}
                    className="text-[#1E88E5] hover:underline whitespace-nowrap"
                >
                    Add / View Marks
                </button>
            ),
        },
    ];

    return (
        <div className="p-4">
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

export default MarksEntryTable;
