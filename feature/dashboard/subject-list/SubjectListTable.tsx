
import React, { useState, useEffect } from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Popconfirm } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SubjectListTableProps extends modalType {
    dataSource?: any[];
    setEditingSubject?: (subject: any) => void;
}

const SubjectListTable = ({ setIsOpen, dataSource, setEditingSubject }: SubjectListTableProps) => { 
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetchUrl(`/subject/${id}`, { method: 'DELETE' });
            if (res?.success) {
                toast.success(res.message || "Subject deleted successfully");
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to delete subject");
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    const columns = [
        {
            title: 'SL',
            key: 'sl',
            responsive: ['sm'] as any,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Subject Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Subject Details',
            dataIndex: 'details',
            key: 'details',
            render: (val: string) => (val && val.trim() ? val : '--------------'),
            responsive: ['md'] as any,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            responsive: ['sm'] as any,
            render: (isActive: boolean) => (
                <span className={isActive ? 'text-green-400' : 'text-red-400'}>
                    {isActive ? 'Active' : 'InActive'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-4">
                    <button 
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit Subject"
                        onClick={() => {
                            if (setEditingSubject) setEditingSubject(record);
                            setIsOpen(true);
                        }}
                    >
                        <FiEdit size={18} />
                    </button>

                    {mounted ? (
                        <Popconfirm
                            title="Delete the subject"
                            description="Are you sure to delete this subject?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <button 
                                className="text-red-500 hover:text-red-700 transition"
                                title="Delete Subject"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </Popconfirm>
                    ) : (
                        <button 
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete Subject"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>      
            <TableMain
                rowKey="_id"
                columns={columns}
                dataSource={dataSource || []}
                className="w-full custom-table"
            />
        </div>
    );
};

export default SubjectListTable;