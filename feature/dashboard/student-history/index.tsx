"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React, { useState } from 'react';
import { fetchUrl } from '@/lib/fetchUrl';
import FilterForm from './FilterForm';
import { Input } from 'antd';
import { FiSearch } from 'react-icons/fi';
import StudentHistoryTable from './StudentHistoryTable';
const StudentHistory = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFilter = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetchUrl(`/user/history/${id}`);
            if (res.success) {
                // Wrap in array if it's a single object
                const historyData = Array.isArray(res.data) ? res.data : [res.data];
                setHistory(historyData);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <HeaderTitle title="Student Details" />
            <div className='flex-center w-full h-full pb-10 md:pt-0 pt-3 '>
                <FilterForm onFinish={handleFilter} />
            </div>

            <div className="flex md:flex-row flex-col md:items-center justify-between md:space-y-0 space-y-4 mb-6">
                <HeaderTitle title="Student History" />
                <Input placeholder="Search" className=" md:max-w-[320px] w-full" style={{ height: 40 }} prefix={<FiSearch size={20} />} />
            </div>
            <StudentHistoryTable data={history} loading={loading} />
        </div>
    );
};

export default StudentHistory;