import React, { useEffect, useState } from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useSearchParams } from 'next/navigation';
import { fetchUrl } from '@/lib/fetchUrl';
import { Modal } from 'antd';
import { toast } from 'react-hot-toast';

const FilteredStudentTable = ({ 
  setIsOpen, 
  refreshTrigger, 
  onEdit, 
  onRefresh 
}: modalType & { 
  refreshTrigger?: number; 
  onEdit?: (student: any) => void;
  onRefresh?: () => void;
}) => {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('isDeleted', 'true');
        params.set('isDelete', 'true');
        const res = await fetchUrl(`/assigned/filter?${params.toString()}`);
        if (res?.success) {
          setStudents(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch filtered students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchParams, refreshTrigger]);

  const handleDelete = (id: string) => {
    Modal.confirm({
        title: 'Are you sure you want to PERMANENTLY delete this student?',
        content: 'This action cannot be undone and will remove the record entirely.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
            try {
                // Assuming permanent delete is also DELETE /assigned/{id}
                const res = await fetchUrl(`/assigned/${id}`, { method: 'DELETE' });
                if (res.success) {
                    toast.success(res.message || 'Student deleted permanently');
                    if (onRefresh) onRefresh();
                } else {
                    toast.error(res.message || 'Failed to delete student');
                }
            } catch (error) {
                toast.error('An error occurred during deletion');
            }
        }
    });
  };

const columns = [
    {
      title: 'SL',
      key: 'sl',
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
      title: 'Mobile No.',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Passport No.',
      dataIndex: 'passportNumber',
      key: 'passportNumber',
      render: (val: string) => (val && val.trim() ? val : '-----'),
    },
    {
      title: 'Batch',
      key: 'batch',
      render: (record: any) => record.batchName?.name || '-',
    },
    {
      title: 'Subject',
      key: 'subject',
      render: (record: any) => record.subjectName?.name || '-',
    },
    {
      title: 'Section',
      key: 'section',
      render: (record: any) => record.sectionName?.name || '-',
    },
    {
      title: 'Special Fee',
      dataIndex: 'specialFee',
      key: 'specialFee',
      render: (val: string) => (val && val.trim() ? val : '-----'),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (val: string) => (
            <span className={val === 'Waiting' ? 'text-yellow-500' : 'text-green-500'}>
                {val || '-'}
            </span>
        )
    },
    {
      title: 'Download Form',
      dataIndex: 'downloadForm',
      key: 'downloadForm',
      render: (val: string) => <span className="text-green-400 cursor-pointer">{val}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit && onEdit(record)} className="text-[#FBBF24]">
            <AiOutlineEdit size={16} />
          </button>
          <button onClick={() => handleDelete(record._id)} className="text-[#FF4D4D]">
            <AiOutlineDelete size={16} />
          </button>
        </div>
      ),
    },
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

export default FilteredStudentTable;