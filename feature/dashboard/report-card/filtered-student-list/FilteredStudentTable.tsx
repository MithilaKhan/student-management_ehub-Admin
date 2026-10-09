"use client";

import React, { useState } from "react";
import { Checkbox } from "antd";
import TableMain from "@/shared/TableMain";
import { fetchUrl } from "@/lib/fetchUrl";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import toast from "react-hot-toast";

interface StudentReportTableProps {
  data: any[];
}

const StudentReportTable = ({ data = [] }: StudentReportTableProps) => {
  const searchParams = useSearchParams();
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>([]);
  const [selectedFatherEmails, setSelectedFatherEmails] = useState<string[]>([]);
  const [selectedMotherEmails, setSelectedMotherEmails] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const dataSource = data.map((item, i) => ({
    ...item,
    key: i + 1,
    studentName: item.name || "-",
    batch: item.batchName?.name || (typeof item.batchName === 'string' ? item.batchName : "-"),
    subject: item.subjectName?.name || (typeof item.subjectName === 'string' ? item.subjectName : "-"),
    section: item.sectionName?.name || (typeof item.sectionName === 'string' ? item.sectionName : "-"),
    studentEmail: item.email || "No Email",
    fatherEmail: item.fatherEmail || "No Email",
    motherEmail: item.motherEmail || "No Email",
  }));

  const handleSelectAll = (type: string, checked: boolean) => {
    if (type === "student") {
      const emails = dataSource.map((data) => data.studentEmail).filter(e => e !== "No Email");
      setSelectedStudentEmails(checked ? emails : []);
    } else if (type === "father") {
      const emails = dataSource.map((data) => data.fatherEmail).filter(e => e !== "No Email");
      setSelectedFatherEmails(checked ? emails : []);
    } else if (type === "mother") {
      const emails = dataSource.map((data) => data.motherEmail).filter(e => e !== "No Email");
      setSelectedMotherEmails(checked ? emails : []);
    }
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "key",
      width: 60,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: (
        <div>
          Student Email <br />
          <Checkbox
            onChange={(e) => handleSelectAll("student", e.target.checked)}
            checked={
              selectedStudentEmails.length > 0 &&
              selectedStudentEmails.length === dataSource.filter(d => d.studentEmail !== "No Email").length
            }
          >
            Select All
          </Checkbox>
        </div>
      ),
      dataIndex: "studentEmail",
      key: "studentEmail",
      render: (email: string) => {
        if (email === "No Email" || !email) {
          return <span className="text-[#6B7280] italic text-xs">Not Provided</span>;
        }
        return (
          <Checkbox
            checked={selectedStudentEmails.includes(email)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedStudentEmails([...selectedStudentEmails, email]);
              } else {
                setSelectedStudentEmails(
                  selectedStudentEmails.filter((item) => item !== email)
                );
              }
            }}
            className="text-[#E5E7EB]"
          >
            {email}
          </Checkbox>
        );
      },
    },
    {
      title: (
        <div>
          Father’s Email <br />
          <Checkbox
            onChange={(e) => handleSelectAll("father", e.target.checked)}
            checked={
              selectedFatherEmails.length > 0 &&
              selectedFatherEmails.length === dataSource.filter(d => d.fatherEmail !== "No Email").length
            }
          >
            Select All
          </Checkbox>
        </div>
      ),
      dataIndex: "fatherEmail",
      key: "fatherEmail",
      render: (email: string) => {
        if (email === "No Email" || !email) {
          return <span className="text-[#6B7280] italic text-xs">Not Provided</span>;
        }
        return (
          <Checkbox
            checked={selectedFatherEmails.includes(email)} 
            className="text-[#E5E7EB]"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedFatherEmails([...selectedFatherEmails, email]);
              } else {
                setSelectedFatherEmails(
                  selectedFatherEmails.filter((item) => item !== email)
                );
              }
            }}
          >
            {email}
          </Checkbox>
        );
      },
    },
    {
      title: (
        <div>
          Mother’s Email <br />
          <Checkbox
            onChange={(e) => handleSelectAll("mother", e.target.checked)}
            checked={
              selectedMotherEmails.length > 0 &&
              selectedMotherEmails.length === dataSource.filter(d => d.motherEmail !== "No Email").length
            }
          >
            Select All
          </Checkbox>
        </div>
      ),
      dataIndex: "motherEmail",
      key: "motherEmail",
      render: (email: string) => {
        if (email === "No Email" || !email) {
          return <span className="text-[#6B7280] italic text-xs">Not Provided</span>;
        }
        return (
          <Checkbox
            checked={selectedMotherEmails.includes(email)}
            className="text-[#E5E7EB]"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedMotherEmails([...selectedMotherEmails, email]);
              } else {
                setSelectedMotherEmails(
                  selectedMotherEmails.filter((item) => item !== email)
                );
              }
            }}
          >
            {email}
          </Checkbox>
        );
      },
    },
  ];

  const handleReset = () => {
    setSelectedStudentEmails([]);
    setSelectedFatherEmails([]);
    setSelectedMotherEmails([]);
  };

  const handleSendReports = async () => {
    const hasStudent = selectedStudentEmails.length > 0;
    const hasFather = selectedFatherEmails.length > 0;
    const hasMother = selectedMotherEmails.length > 0;

    if (!hasStudent && !hasFather && !hasMother) {
      toast.error("Please select at least one recipient email");
      return;
    }

    // Determine target students whose emails were selected
    const targetStudents = dataSource.filter(row => 
      (row.studentEmail !== "No Email" && selectedStudentEmails.includes(row.studentEmail)) ||
      (row.fatherEmail !== "No Email" && selectedFatherEmails.includes(row.fatherEmail)) ||
      (row.motherEmail !== "No Email" && selectedMotherEmails.includes(row.motherEmail))
    );

    const studentIds = targetStudents.map(row => row._id).filter(Boolean);

    if (studentIds.length === 0) {
      toast.error("No valid students found for the selected emails");
      return;
    }

    let recipientType: "all" | "student" | "father" | "mother" = "all";
    if (hasStudent && !hasFather && !hasMother) recipientType = "student";
    else if (!hasStudent && hasFather && !hasMother) recipientType = "father";
    else if (!hasStudent && !hasFather && hasMother) recipientType = "mother";
    else recipientType = "all";

    const month = searchParams?.get("month");
    const year = searchParams?.get("year");
    let fromDate: string;
    let toDate: string;

    if (month && year) {
      const m = moment(`${year}-${month}`, "YYYY-MMMM");
      fromDate = m.startOf('month').format("YYYY-MM-DD");
      toDate = m.endOf('month').format("YYYY-MM-DD");
    } else {
      fromDate = moment().startOf('month').format("YYYY-MM-DD");
      toDate = moment().endOf('month').format("YYYY-MM-DD");
    }

    try {
      setSending(true);
      const res = await fetchUrl('/reportCard/send-history', {
        method: 'POST',
        body: JSON.stringify({
          fromDate,
          toDate,
          recipientType,
          sendType: 'individual',
          studentIds,
        }),
      });

      if (res?.success) {
        const count = res?.data?.sentCount ?? studentIds.length;
        toast.success(`Successfully sent ${count} report email(s)!`);
        handleReset();
      } else {
        toast.error(res?.message || 'Failed to send report emails');
      }
    } catch (error: any) {
      console.error("Failed to send report cards:", error);
      toast.error(error?.message || 'Failed to send report emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4">
      <TableMain
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={{ pageSize: 15 }}
        className="w-full custom-table"
      />

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleReset}
          disabled={sending}
          className="bg-[#3E1B1F] text-red-500 hover:bg-[#4E2227] transition-colors h-[40px] px-6 rounded-md cursor-pointer disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={handleSendReports}
          disabled={sending}
          className="bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors text-white h-[40px] px-6 rounded-md cursor-pointer disabled:opacity-50 font-medium"
        >
          {sending ? 'Sending...' : 'Send Reports'}
        </button>
      </div> 
    </div>
  );
};

export default StudentReportTable;
