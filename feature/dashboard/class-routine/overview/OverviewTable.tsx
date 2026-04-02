
import React from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Popconfirm } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface OverviewTableProps extends modalType {
    data: any[];
    setSelectedRoutine: (routine: any) => void;
}

const OverviewTable = ({ data, setIsOpen, setSelectedRoutine }: OverviewTableProps) => { 
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const res = await fetchUrl(`/routine/${id}`, {
                method: "DELETE",
            });
            if (res.success) {
                toast.success("Routine deleted successfully");
                router.refresh();
            } else {
                toast.error(res.message || "Failed to delete routine");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        }
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
            title: 'Routine Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Subject Name',
            key: 'subjectName',
            render: (record: any) => record.subjectName?.name || '-',
        },
        {
            title: 'Batch Name',
            key: 'batchName',
            render: (record: any) => record.batchName?.name || '-',
        },
        {
            title: 'Section',
            key: 'section',
            render: (record: any) => record.section?.name || '-',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (val: string) => val || '-',
        },
        {
            title: 'Is Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (val: boolean) => (
                <span className={val ? 'text-green-400' : 'text-[#ABABAB]'}>
                    {val ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => {
                            setSelectedRoutine(record);
                            setIsOpen(true);
                        }}
                        className="text-[#1A5FA4] hover:text-[#2879cd] transition-colors flex items-center gap-2"
                    >
                        <FiEdit size={16} />
                    </button>
                    <Popconfirm
                        title="Delete the routine"
                        description="Are you sure to delete this routine?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <button className="text-[#FF4D4D] hover:text-red-500 transition-colors flex items-center">
                            <FiTrash2 size={16} />
                        </button>
                    </Popconfirm>
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

export default OverviewTable;