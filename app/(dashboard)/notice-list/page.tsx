import NoticeList from "@/feature/dashboard/notice-list";
import { fetchServer } from "@/lib/fetchServer";
import React from "react";

const NoticeListPage = async () => {
  const res = await fetchServer("/notice");
  const data = res?.data || [];

  return (
    <div>
      <NoticeList data={data} />
    </div>
  );
};

export default NoticeListPage;
