"use client";
import React from 'react';
import TableMain from '@/shared/TableMain';
import moment from 'moment';

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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Batch Name',
      key: 'batchName',
      render: (record: any) => record.batchName?.name || record.batchName || '-',
    },
    {
      title: 'Batch Start',
      key: 'batchStart',
      render: (record: any) => record.batchName?.startDate ? moment(record.batchName.startDate).format('DD MMM YYYY') : '-',
    },
    {
      title: 'Batch End',
      key: 'batchEnd',
      render: (record: any) => record.batchName?.endDate ? moment(record.batchName.endDate).format('DD MMM YYYY') : '-',
    },
    {
      title: 'Enrolment Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => val ? moment(val).format('DD MMM YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <span className={val === 'Waiting' ? 'text-yellow-400' : 'text-green-400'}>{val || '-'}</span>
      ),
    },
    {
      title: 'Disenrolment Date',
      dataIndex: 'disenrolmentDate',
      key: 'disenrolmentDate',
      render: (val: string) => val ? moment(val).format('DD MMM YYYY') : '-',
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