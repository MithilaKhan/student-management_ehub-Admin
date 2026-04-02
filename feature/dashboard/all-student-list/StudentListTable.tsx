"use client";
import React, { useState } from 'react';
import TableMain from '@/shared/TableMain';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaBan, FaCheck } from 'react-icons/fa';
import { modalType } from '@/type';

interface StudentListTableProps extends modalType {
    data: any[];
}

const StudentListTable = ({ setIsOpen, data }: StudentListTableProps) => {
    const [blockedUsers, setBlockedUsers] = useState<number[]>([]);

    const handleBlockToggle = (id: number) => {
        setBlockedUsers(prev =>
            prev.includes(id)
                ? prev.filter(userId => userId !== id)
                : [...prev, id]
        );
    };

    const columns = [
        {
            title: 'SL',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (val: string) => val || '-',
        },
        {
            title: 'Grade',
            dataIndex: 'gradeName',
            key: 'gradeName',
            render: (val: string) => val || '-',
        },
        {
            title: 'Subject',
            key: 'subjectName',
            render: (record: any) => record.subjectName?.name || '-',
        },
        {
            title: 'Batch',
            key: 'batchName',
            render: (record: any) => record.batchName?.name || '-',
        },
        {
            title: 'Section',
            key: 'section',
            render: (record: any) => record.sectionName?.name || '-',
        },
        {
            title: 'Passport No.',
            dataIndex: 'passportNumber',
            key: 'passportNumber',
            render: (val: string) => val || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (val: string) => (
                <span className={val === 'Active' ? 'text-green-500' : 'text-yellow-500'}>
                    {val || '-'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsOpen(true)} className="text-[#FBBF24]">
                        <AiOutlineEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleBlockToggle(record._id)}
                        className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${blockedUsers.includes(record._id)
                            ? 'text-red-500 hover:text-red-400'
                            : ' text-green-500 hover:text-green-400'
                            }`}
                    >
                        {blockedUsers.includes(record._id) ? (
                            <>
                                <FaBan size={14} />
                                <span>Block</span>
                            </>
                        ) : (
                            <>
                                <FaCheck size={14} />
                                <span>Unblock</span>
                            </>
                        )}
                    </button>
                </div>
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

export default StudentListTable;