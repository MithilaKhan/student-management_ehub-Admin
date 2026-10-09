
"use client";
import React, { useState, useEffect } from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { AiOutlineDelete } from 'react-icons/ai';
import { fetchUrl } from '@/lib/fetchUrl';
import { Modal } from 'antd';
import toast from 'react-hot-toast';

interface AddAdminTableProps extends modalType {
    refreshTrigger?: number;
    onRefresh?: () => void;
}

const AddAdminTable = ({ setIsOpen, refreshTrigger, onRefresh }: AddAdminTableProps) => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetchUrl('/admin/get-admin');
            if (res?.success) {
                setAdmins(res.data || []);
            }
        } catch (error: any) {
            console.error('Failed to fetch admins:', error);
            toast.error(error?.message || 'Failed to fetch admin list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [refreshTrigger]);

    const handleDelete = (id: string, name: string) => {
        Modal.confirm({
            title: `Are you sure you want to delete admin "${name}"?`,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            className: 'custom-confirm-modal',
            async onOk() {
                try {
                    const res = await fetchUrl(`/admin/${id}`, {
                        method: 'DELETE',
                    });
                    if (res?.success) {
                        toast.success(res?.message || 'Admin deleted successfully');
                        fetchAdmins();
                        if (onRefresh) onRefresh();
                    } else {
                        toast.error(res?.message || 'Failed to delete admin');
                    }
                } catch (error: any) {
                    toast.error(error?.message || 'Failed to delete admin');
                }
            },
        });
    };

    const columns = [
        {
            title: 'SL',
            key: 'sl',
            width: 70,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="text-white font-medium">{text || 'N/A'}</span>,
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className="text-[#ABABAB]">{text || 'N/A'}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDelete(record._id, record.name)}
                        className="text-red-500 hover:text-red-400 p-1.5 rounded bg-red-500/10 cursor-pointer"
                        title="Delete Admin"
                    >
                        <AiOutlineDelete size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <TableMain
                columns={columns}
                dataSource={admins} 
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="w-full custom-table"
            />
        </div>
    );
};

export default AddAdminTable;