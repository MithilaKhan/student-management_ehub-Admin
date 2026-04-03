"use client";

import React, { useEffect, useState } from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { useSearchParams } from 'next/navigation';
import { fetchUrl } from '@/lib/fetchUrl';

const FilteredWaitingTable = () => {
    const searchParams = useSearchParams();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWaitingList = async () => {
            setLoading(true);
            try {
                const query = searchParams.toString();
                const res = await fetchUrl(`/assigned/waiting-list?${query}`);
                if (res?.success) {
                    setStudents(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch waiting list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWaitingList();
    }, [searchParams]);

    const columns = [
        {
            title: 'Waiting No.',
            dataIndex: 'waitingNumber',
            key: 'waitingNumber',
            render: (val: number) => val || '-',
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
            title: 'Mobile No.',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Batch',
            key: 'batch',
            render: (record: any) => record.batchData?.name || '-',
        },
        {
            title: 'Subject',
            key: 'subject',
            render: (record: any) => record.subjectData?.name || '-',
        },
        {
            title: 'Section',
            key: 'section',
            render: (record: any) => record.sectionData?.name || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (val: string) => (
                <span className="text-yellow-500 font-medium">
                    {val || 'Waiting'}
                </span>
            ),
        }
    ];

    return (
        <div>
            <TableMain
                loading={loading}
                columns={columns}
                dataSource={students}
                rowKey="_id"
                pagination={{
                    pageSize: 7,
                    total: students.length,
                    showSizeChanger: false,
                    showQuickJumper: false,
                }}
                className="w-full custom-table"
            />
        </div>
    );
};

export default FilteredWaitingTable;
