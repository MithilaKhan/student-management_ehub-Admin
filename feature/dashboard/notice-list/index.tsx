"use client";
import HeaderTitle from "@/shared/HeaderTitle";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "antd";
import NoticeTable from "./NoticeTable";
import AddNoticeModal from "./AddNoticeModal";

const NoticeList = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            type="submit"
            className="bg-[#1A5FA4] h-[40px] w-full md:max-w-[200px] rounded-md text-white"
            onClick={() => setIsOpen(true)}
          >
            + Add Notice
          </button>
        </div>
      </div>
      <NoticeTable setIsOpen={setIsOpen} />
      <AddNoticeModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default NoticeList;
