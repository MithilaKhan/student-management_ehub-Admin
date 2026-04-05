"use client";

import React, { useState } from "react";
import { Checkbox } from "antd";
import TableMain from "@/shared/TableMain";

interface StudentReportTableProps {
  data: any[];
}

const StudentReportTable = ({ data = [] }: StudentReportTableProps) => {
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>([]);
  const [selectedFatherEmails, setSelectedFatherEmails] = useState<string[]>([]);
  const [selectedMotherEmails, setSelectedMotherEmails] = useState<string[]>([]);

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
      render: (email: string) => (
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
          disabled={email === "No Email"}
        >
          {email}
        </Checkbox>
      ),
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
      render: (email: string) => (
        <Checkbox
          checked={selectedFatherEmails.includes(email)} 
          style={{color:"white"}}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedFatherEmails([...selectedFatherEmails, email]);
            } else {
              setSelectedFatherEmails(
                selectedFatherEmails.filter((item) => item !== email)
              );
            }
          }}
          disabled={email === "No Email"}
        >
          {email}
        </Checkbox>
      ),
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
      render: (email: string) => (
        <Checkbox
          checked={selectedMotherEmails.includes(email)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMotherEmails([...selectedMotherEmails, email]);
            } else {
              setSelectedMotherEmails(
                selectedMotherEmails.filter((item) => item !== email)
              );
            }
          }}
          disabled={email === "No Email"}
        >
          {email}
        </Checkbox>
      ),
    },
  ];

  const handleReset = () => {
    setSelectedStudentEmails([]);
    setSelectedFatherEmails([]);
    setSelectedMotherEmails([]);
  };

  const handleSendReports = () => {
    console.log("Selected Emails:", {
      student: selectedStudentEmails,
      father: selectedFatherEmails,
      mother: selectedMotherEmails,
    });
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
          className="bg-[#3E1B1F] text-red-500 h-[40px] px-6 rounded-md"
        >
          Reset
        </button>
        <button
          onClick={handleSendReports}
          className="bg-[#1A5FA4] text-white h-[40px] px-6 rounded-md"
        >
          Send Reports
        </button>
      </div> 
    </div>
  );
};

export default StudentReportTable;
