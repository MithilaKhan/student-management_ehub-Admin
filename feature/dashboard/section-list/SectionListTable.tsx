import React from 'react';
import { modalType } from '@/type';
import TableMain from '@/shared/TableMain';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Popconfirm } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SectionListTableProps extends modalType {
  data: any[];
  setSelectedSection: React.Dispatch<any>;
}

const SectionListTable = ({ setIsOpen, data, setSelectedSection }: SectionListTableProps) => { 
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const res = await fetchUrl(`/section/${id}`, {
                method: 'DELETE',
            });
            if (res.success) {
                toast.success('Section deleted successfully');
                router.refresh();
            } else {
                toast.error(res.message || 'Failed to delete section');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    const columns = [
    {
      title: 'SL',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Section Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subject',
      key: 'subjectName',
      render: (record: any) => record.subjectName?.name || '-',
    },
    {
      title: 'Batch Name',
      key: 'batchName',
      render: (record: any) => record.batchName?.name || '-',
    },
    {
      title: 'Seats Empty',
      dataIndex: 'emptySeat',
      key: 'emptySeat',
      render: (val: number) => val ?? '-',
    },
    {
      title: 'Seats Filled',
      dataIndex: 'bookedSeat',
      key: 'bookedSeat',
      render: (val: number) => val ?? '-',
    },
    {
      title: 'Total Seats',
      dataIndex: 'totalSeat',
      key: 'totalSeat',
      render: (val: number) => val ?? '-',
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (val: boolean) => (
        <span className={val ? 'text-green-400' : 'text-red-400'}>
          {val ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <div className="flex gap-4 items-center">
          <button 
            className="text-sm text-[#1A5FA4] cursor-pointer hover:text-[#2879cd] transition-colors" 
            onClick={() => {
              setSelectedSection(record);
              setIsOpen(true);
            }}
          >
            <FiEdit size={18} />
          </button>
          
          <Popconfirm
            title="Delete the section"
            description="Are you sure to delete this section?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="text-sm text-[#FF4D4D] cursor-pointer hover:text-red-500 transition-colors">
              <FiTrash2 size={18} />
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
                className="w-full custom-table"
            />
        </div>
    );
};

export default SectionListTable;