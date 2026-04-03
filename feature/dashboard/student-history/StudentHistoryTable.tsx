"use client";
import React from 'react';
import TableMain from '@/shared/TableMain';

const StudentHistoryTable = ({ data, loading }: { data: any[], loading: boolean }) => {
  const columns = [
    {
      title: 'SL',
      key: 'sl',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Batch Name',
      key: 'batchName',
      render: (record: any) => record.batchName?.name || record.batchName || '-',
    },
    {
      title: 'Batch Start',
      key: 'batchStart',
      render: (record: any) => record.batchName?.startDate || record.batchStart || '-',
    },
    {
      title: 'Batch End',
      key: 'batchEnd',
      render: (record: any) => record.batchName?.endDate || record.batchEnd || '-',
    },
    {
      title: 'Enrolment Date',
      dataIndex: 'enrolmentDate',
      key: 'enrolmentDate',
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (val: string) => (
        <span className="text-green-400">{val}</span>
      ),
    },
    {
      title: 'Disenrolment Date',
      dataIndex: 'disenrolmentDate',
      key: 'disenrolmentDate',
    },
  ];

  return (
    <div>
      <TableMain
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6}}
        className="w-full custom-table"
        rowKey="_id"
      />
    </div>
  );
};

export default StudentHistoryTable;