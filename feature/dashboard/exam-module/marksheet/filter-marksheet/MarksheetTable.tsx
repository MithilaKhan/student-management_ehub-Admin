"use client";
import React, { useEffect, useState } from "react";
import TableMain from "@/shared/TableMain";
import { fetchUrl } from "@/lib/fetchUrl";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface MarksheetTableProps {
    searchTerm?: string;
}

const MarksheetTable = ({ searchTerm = "" }: MarksheetTableProps) => {
    const searchParams = useSearchParams();
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const subjectName = searchParams.get('subjectName');
    const batchName = searchParams.get('batchName');

    const fetchMarksheetData = async () => {
        try {
            setLoading(true);
            const res = await fetchUrl('/marksEntry');
            if (res?.success && Array.isArray(res?.marksEntryRecords)) {
                // Flatten the nested student array inside marksEntryRecords
                const flattened: any[] = [];
                res.marksEntryRecords.forEach((record: any, recIdx: number) => {
                    const students = Array.isArray(record.students) ? record.students : [];
                    students.forEach((stu: any, stuIdx: number) => {
                        flattened.push({
                            key: `${recIdx}-${stuIdx}-${stu.studentId || ''}`,
                            studentId: stu.studentId,
                            name: stu.name || "N/A",
                            appId: stu.appId || "N/A",
                            examName: record.examName || "N/A",
                            subjectName: record.subjectName || "N/A",
                            batchName: record.batchName || "N/A",
                            marksObtained: stu.marksObtained ?? "-",
                            totalMarks: stu.totalMarks ?? "-",
                            percentage: stu.percentage || "-",
                        });
                    });
                });
                setRows(flattened);
            }
        } catch (error: any) {
            console.error("Failed to fetch marksheet data:", error);
            toast.error(error?.message || "Failed to fetch marksheet records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarksheetData();
    }, []);

    const filteredRows = rows.filter((item) => {
        // Filter by subjectName or batchName if passed from previous form
        if (subjectName && item.subjectName && !item.subjectName.toLowerCase().includes(subjectName.toLowerCase())) {
            // allow relaxed match
        }
        if (batchName && item.batchName && !item.batchName.toLowerCase().includes(batchName.toLowerCase())) {
            // allow relaxed match
        }

        // Search term filter
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name?.toLowerCase().includes(term) ||
            item.appId?.toLowerCase().includes(term) ||
            item.examName?.toLowerCase().includes(term)
        );
    });

    const columns = [
        {
            title: "SL",
            key: "sl",
            width: 70,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Student Name",
            dataIndex: "name",
            key: "name",
            render: (val: string) => <span className="text-white font-medium">{val}</span>,
        },
        {
            title: "Student App ID",
            dataIndex: "appId",
            key: "appId",
            render: (val: string) => <span className="text-[#ABABAB]">{val}</span>,
        },
        {
            title: "Exam Name",
            dataIndex: "examName",
            key: "examName",
            render: (val: string) => <span className="text-[#ABABAB]">{val}</span>,
        },
        {
            title: "Subject",
            dataIndex: "subjectName",
            key: "subjectName",
            render: (val: string) => <span className="text-[#ABABAB]">{val}</span>,
        },
        {
            title: "Batch",
            dataIndex: "batchName",
            key: "batchName",
            render: (val: string) => <span className="text-[#ABABAB]">{val}</span>,
        },
        {
            title: "Marks Obtained",
            dataIndex: "marksObtained",
            key: "marksObtained",
            render: (val: any) => <span className="text-[#10B981] font-semibold">{val}</span>,
        },
        {
            title: "Total Marks",
            dataIndex: "totalMarks",
            key: "totalMarks",
            render: (val: any) => <span className="text-[#ABABAB]">{val}</span>,
        },
        {
            title: "Percentage",
            dataIndex: "percentage",
            key: "percentage",
            render: (val: string) => <span className="text-white font-medium">{val}</span>,
        },
    ];

    return (
        <div className="custom-table w-full">
            <TableMain
                rowKey="key"
                columns={columns}
                dataSource={filteredRows}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowClassName="custom-table"
            />
        </div>
    );
};

export default MarksheetTable;
