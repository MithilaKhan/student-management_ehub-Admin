
import React, { useState } from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { FaBan, FaCheck } from 'react-icons/fa6';
import { AiOutlineEdit } from 'react-icons/ai';
const AddTeacherTable = ({ setIsOpen }: modalType) => {
    const [blockedUsers, setBlockedUsers] = useState<number[]>([]);

    const dataSource = Array.from({ length: 10 }).map((_, i) => ({
        key: i + 1,
        id: i + 1,
        fullName: "Adiyat Rahman",
        email: "1adiat20anjumj@gmail.com",
    }));

    const handleBlockToggle = (id: number) => {
        setBlockedUsers((prev: any) =>
            prev.includes(id)
                ? prev.filter((userId: string | number) => userId !== id)
                : [...prev, id]
        );
    };

    const columns = [
        {
            title: 'SL',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
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
                        onClick={() => handleBlockToggle(record.id)}
                        className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${blockedUsers.includes(record.id)
                            ? 'text-red-500 hover:text-red-400'
                            : ' text-green-500 hover:text-green-400'
                            }`}
                    >
                        {blockedUsers.includes(record.id) ? (
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
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 9 }}
                className="w-full custom-table"
            />
        </div>
    );
};

export default AddTeacherTable;