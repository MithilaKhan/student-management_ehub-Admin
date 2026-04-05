"use client";
import HeaderTitle from "@/shared/HeaderTitle";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "antd";
import NoticeTable from "./NoticeTable";
import AddNoticeModal from "./AddNoticeModal";

interface NoticeListProps {
  data: any[];
}

const NoticeList = ({ data }: NoticeListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleAddOpen = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const handleEditOpen = (record: any) => {
    setEditData(record);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
        <HeaderTitle title="Notice List" />

        <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
          <Input
            placeholder="Search"
            className="md:max-w-[280px] w-full"
            style={{ height: 40 }}
            prefix={<FiSearch size={20} />}
          />

          <button
            type="button"
            className="bg-[#1A5FA4] h-[40px] w-full md:max-w-[200px] rounded-md text-white"
            onClick={handleAddOpen}
          >
            + Add Notice
          </button>
        </div>
      </div>
      <NoticeTable data={data} onEdit={handleEditOpen} />
      <AddNoticeModal isOpen={isOpen} setIsOpen={setIsOpen} initialData={editData} />
    </div>
  );
};

export default NoticeList;
