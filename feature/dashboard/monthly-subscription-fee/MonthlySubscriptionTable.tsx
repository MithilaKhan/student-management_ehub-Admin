"use client";
import React from 'react';
import TableMain from '@/shared/TableMain';

interface MonthlySubscriptionTableProps {
    data: any[];
}

const MonthlySubscriptionTable = ({ data }: MonthlySubscriptionTableProps) => {

  const columns = [
    {
      title: 'SL',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    { title: 'Student Name', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Subject name', dataIndex: 'subjectName', key: 'subjectName' },
    { title: 'Teacher name', dataIndex: 'teacherName', key: 'teacherName' },
    { title: 'Total SMS Count', dataIndex: 'totalSmsCount', key: 'totalSmsCount',  render: (v: number) => v ?? '-' },
    { title: 'SMS Rate', dataIndex: 'smsRate', key: 'smsRate',  render: (v: number) => (typeof v === 'number' ? v.toFixed(2) : '-') },
    { title: 'Total Cost', dataIndex: 'totalCost', key: 'totalCost',  render: (v: number) => (typeof v === 'number' ? v.toFixed(2) : '-') },
  ];

  return (
    <div>
      <TableMain
        columns={columns}
        dataSource={data}
        rowKey={(record: any) => record._id || record.id || Math.random()}
        className="w-full custom-table"
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
};

export default MonthlySubscriptionTable;