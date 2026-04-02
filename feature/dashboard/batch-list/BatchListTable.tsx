import React from "react";
import { modalType } from "@/type";
import TableMain from "@/shared/TableMain";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Popconfirm } from "antd";
import { fetchUrl } from "@/lib/fetchUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BatchListTableProps extends modalType {
  dataSource?: any[];
  setEditingBatch?: (batch: any) => void;
}

const BatchListTable = ({
  setIsOpen,
  dataSource,
  setEditingBatch,
}: BatchListTableProps) => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetchUrl(`/batch/${id}`, { method: "DELETE" });
      if (res?.success) {
        toast.success(res.message || "Batch deleted successfully");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete batch");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Batch Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Batch Details",
      dataIndex: "batchDetails",
      key: "batchDetails",
      render: (val: string) => (val && val.trim() ? val : "--------------"),
      width: 300,
    },
    {
      title: "Batch Msg",
      dataIndex: "batchMessage",
      key: "batchMessage",
      render: (val: string) => (val && val.trim() ? val : "-"),
      width: 300,
    },
    {
      title: "Subject Name",
      key: "subjectName",
      render: (_: any, record: any) => record?.subjectName?.name || "-",
    },
    {
      title: "Reg. Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    {
      title: "Reg. End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-400" : "text-red-400"}>
          {isActive ? "Active" : "InActive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
          <button
            className="text-blue-500 hover:text-blue-700 transition"
            title="Edit Batch"
            onClick={() => {
              if (setEditingBatch) setEditingBatch(record);
              setIsOpen(true);
            }}
          >
            <FiEdit size={18} />
          </button>

          {mounted ? (
              <Popconfirm
                 title="Delete the batch"
                 description="Are you sure to delete this batch?"
                 onConfirm={() => handleDelete(record._id)}
                 okText="Yes"
                 cancelText="No"
              >
                <button
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Batch"
                >
                    <FiTrash2 size={18} />
                </button>
              </Popconfirm>
          ) : (
              <button
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete Batch"
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
        dataSource={dataSource}
        className="w-full custom-table"
      />
    </div>
  );
};

export default BatchListTable;
