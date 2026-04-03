"use client";

import React, { useState } from "react";
import { Table, Button, Checkbox } from "antd";
import TableMain from "@/shared/TableMain";

const StudentReportTable = () => {
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>([]);
  const [selectedFatherEmails, setSelectedFatherEmails] = useState<string[]>([]);
  const [selectedMotherEmails, setSelectedMotherEmails] = useState<string[]>([]);

  const dataSource = Array.from({ length: 7 }).map((_, i) => ({
    key: i + 1,
    studentName: "Adiyat Rahman",
    batch: "IAL - A2 Accounting May 2026 B#1",
    subject: "IAL Accounting A2",
    section: "Batch 01",
    studentEmail: "1adiat20anjumj@gmail.com",
    fatherEmail: "abc@gamil.com",
    motherEmail: "abc@gamil.com",
  }));

  const handleSelectAll = (type: string, checked: boolean) => {
    const allEmails = dataSource.map((data) => data.studentEmail);
    if (type === "student") {
      setSelectedStudentEmails(checked ? allEmails : []);
    } else if (type === "father") {
      setSelectedFatherEmails(checked ? allEmails : []);
    } else if (type === "mother") {
      setSelectedMotherEmails(checked ? allEmails : []);
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
              selectedStudentEmails.length === dataSource.length &&
              dataSource.length > 0
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
              selectedFatherEmails.length === dataSource.length &&
              dataSource.length > 0
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
              selectedMotherEmails.length === dataSource.length &&
              dataSource.length > 0
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
        pagination={{ pageSize: 7 }}
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
