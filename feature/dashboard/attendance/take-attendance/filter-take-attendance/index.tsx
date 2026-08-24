"use client";
import React, { useEffect, useMemo, useState } from "react";
import TableMain from "@/shared/TableMain";
import { Checkbox, Switch, Select, Input, Card, ConfigProvider, theme } from "antd";
import { FiEdit } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const ordinal = (d: number) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatNiceDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day}${ordinal(day)} ${month}, ${year}`;
};

interface AttendanceRecord {
  status: "PRESENT" | "ABSENT" | "LATE";
  remarks: string;
  sendSMS: boolean;
  smsReceiver: "FATHER" | "MOTHER" | "GUARDIAN" | "STUDENT";
}

const FilterTakeAttendance = () => {
  const search = useSearchParams();
  const grade = search?.get("grade") || "";
  const subjectId = search?.get("subject") || "";
  const batchId = search?.get("batch") || "";
  const sectionId = search?.get("section") || "";
  const dateParam = search?.get("date");
  const displayDate = dateParam ? new Date(dateParam) : new Date();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceRecordId, setAttendanceRecordId] = useState<string | null>(null);
  
  // Refactored State
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});

  const dateStr = displayDate.toISOString().split('T')[0];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (grade) params.append("gradeName", grade);
      if (subjectId) params.append("subjectName", subjectId);
      if (batchId) params.append("batchName", batchId);
      if (sectionId) params.append("sectionName", sectionId);

      try {
        const endpoint = params.toString() ? `/assigned/filter?${params.toString()}` : `/assigned`;
        const res = await fetchUrl(endpoint);
        if (res?.success) {
          setStudents(res.data?.items || res.data || []);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch filtered students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [grade, subjectId, batchId, sectionId]);

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      if (!sectionId || !batchId || !subjectId) return;
      try {
        const query = new URLSearchParams({
          grade,
          sectionId,
          batchId,
          subjectId,
          date: dateStr
        });
        const res = await fetchUrl(`/attendence?${query.toString()}`);
        if (res?.success && res.data && res.data.length > 0) {
          const sorted = [...res.data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          const record = sorted[0];
          setAttendanceRecordId(record._id);
          
          const map: Record<string, AttendanceRecord> = {};
          record.attendence.forEach((item: any) => {
            const sId = typeof item.studentId === 'object' ? item.studentId._id : item.studentId;
            map[sId] = {
              status: item.status,
              remarks: item.remarks || "",
              sendSMS: item.sendSMS || false,
              smsReceiver: item.smsReceiver || "FATHER"
            };
          });
          setAttendanceMap(map);
        } else {
          setAttendanceRecordId(null);
          setAttendanceMap({});
        }
      } catch (e) {
        console.error("Failed to fetch existing attendance", e);
      }
    };
    fetchExistingAttendance();
  }, [grade, sectionId, batchId, subjectId, dateStr]);

  const presentCount = useMemo(
    () => students.filter((s) => attendanceMap[s._id]?.status === "PRESENT").length,
    [attendanceMap, students]
  );

  // Default record state
  const getDefaultRecord = (status: "PRESENT" | "ABSENT" | "LATE"): AttendanceRecord => ({
    status,
    remarks: "",
    sendSMS: false,
    smsReceiver: "FATHER"
  });

  const handleStatusChange = (id: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setAttendanceMap((prev) => {
      if (prev[id]?.status === status) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: prev[id] ? { ...prev[id], status } : getDefaultRecord(status)
      };
    });
  };

  const updateRecordField = <K extends keyof AttendanceRecord>(id: string, field: K, value: AttendanceRecord[K]) => {
    setAttendanceMap((prev) => {
      if (!prev[id]) {
        return {
          ...prev,
          [id]: { ...getDefaultRecord("PRESENT"), [field]: value }
        };
      }
      return {
        ...prev,
        [id]: { ...prev[id], [field]: value }
      };
    });
  };

  const handleSelectAll = (status: "PRESENT" | "ABSENT" | "LATE", checked: boolean) => {
    if (!checked) {
      setAttendanceMap((prev) => {
        const copy = { ...prev };
        students.forEach((d) => {
          if (copy[d._id]?.status === status) delete copy[d._id];
        });
        return copy;
      });
      return;
    }
    const newMap: Record<string, AttendanceRecord> = { ...attendanceMap };
    students.forEach((d) => {
      if (!newMap[d._id]) {
        newMap[d._id] = getDefaultRecord(status);
      } else {
        newMap[d._id].status = status;
      }
    });
    setAttendanceMap(newMap);
  };

  const handleReset = () => {
    setAttendanceMap({});
    // We intentionally do not reset attendanceRecordId so that they can clear out all students and still hit Update if they want.
  };

  const handleSubmit = async () => {
    if (Object.keys(attendanceMap).length === 0) {
      toast.error("Please mark attendance for at least one student.");
      return;
    }

    const payload = {
      sectionId,
      grade,
      batchId,
      subjectId,
      date: dateStr,
      attendence: Object.entries(attendanceMap).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks || "Not-specify",
        sendSMS: data.sendSMS,
        smsReceiver: data.smsReceiver
      }))
    };

    setIsSubmitting(true);
    try {
      let res;
      if (attendanceRecordId) {
        res = await fetchUrl(`/attendence/${attendanceRecordId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchUrl('/attendence', {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      if (res?.success) {
        toast.success(attendanceRecordId ? "Attendance successfully updated." : "Attendance successfully submitted.");
        if (!attendanceRecordId && res.data?._id) {
          setAttendanceRecordId(res.data._id);
        }
      } else {
        toast.error(res?.message || "Failed to submit attendance.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => <span className="font-medium">{name || record.studentName || record.fullName || 'Unknown'}</span>,
    },
    {
      title: "Attendance Status",
      children: [
        {
          title: (
            <div className="text-center flex flex-col items-center gap-1">
              <div className="text-sm">Present</div>
              <Checkbox
                onChange={(e) => handleSelectAll("PRESENT", e.target.checked)}
                checked={
                  students.length > 0 &&
                  students.every(s => attendanceMap[s._id]?.status === "PRESENT")
                }
              />
            </div>
          ),
          dataIndex: "present",
          key: "present",
          width: 90,
          render: (_: any, record: any) => (
            <div className="flex justify-center">
              <Checkbox
                checked={attendanceMap[record._id]?.status === "PRESENT"}
                onChange={() => handleStatusChange(record._id, "PRESENT")}
              />
            </div>
          ),
        },
        {
          title: (
            <div className="text-center flex flex-col items-center gap-1 ">
              <div className="text-sm">Absent</div>
              <Checkbox
                onChange={(e) => handleSelectAll("ABSENT", e.target.checked)}
                checked={
                  students.length > 0 &&
                  students.every(s => attendanceMap[s._id]?.status === "ABSENT")
                }
              />
            </div>
          ),
          dataIndex: "absent",
          key: "absent",
          width: 90,
          render: (_: any, record: any) => (
            <div className="flex justify-center">
              <Checkbox
                checked={attendanceMap[record._id]?.status === "ABSENT"}
                onChange={() => handleStatusChange(record._id, "ABSENT")}
              />
            </div>
          ),
        },
        {
          title: (
            <div className="text-center flex flex-col items-center gap-1">
              <div className="text-sm">Late</div>
              <Checkbox
                onChange={(e) => handleSelectAll("LATE", e.target.checked)}
                checked={
                  students.length > 0 &&
                  students.every(s => attendanceMap[s._id]?.status === "LATE")
                }
              />
            </div>
          ),
          dataIndex: "late",
          key: "late",
          width: 90,
          render: (_: any, record: any) => (
            <div className="flex justify-center">
              <Checkbox
                checked={attendanceMap[record._id]?.status === "LATE"}
                onChange={() => handleStatusChange(record._id, "LATE")}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: "SMS Notification",
      children: [
        {
          title: "Send SMS?",
          dataIndex: "sendSMS",
          key: "sendSMS",
          width: 120,
          render: (_: any, record: any) => (
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              checked={attendanceMap[record._id]?.sendSMS || false}
              onChange={(checked) => updateRecordField(record._id, "sendSMS", checked)}
            />
          ),
        },
        {
          title: "Receiver",
          dataIndex: "smsReceiver",
          key: "smsReceiver",
          width: 150,
          render: (_: any, record: any) => {
            const isDisabled = !(attendanceMap[record._id]?.sendSMS);
            return (
              <Select
                value={attendanceMap[record._id]?.smsReceiver || "FATHER"}
                onChange={(val) => updateRecordField(record._id, "smsReceiver", val)}
                disabled={isDisabled}
                style={{ width: '100%' }}
                options={[
                  { label: "Father", value: "FATHER" },
                  { label: "Mother", value: "MOTHER" },
                  { label: "Guardian", value: "GUARDIAN" },
                  { label: "Student", value: "STUDENT" },
                ]}
              />
            );
          },
        },
      ]
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (_: any, record: any) => (
        <Input
          placeholder="Optional remarks..."
          value={attendanceMap[record._id]?.remarks || ""}
          onChange={(e) => updateRecordField(record._id, "remarks", e.target.value)}
          allowClear
          className="bg-[#1e293b] text-white border-gray-600"
        />
      ),
    },
  ];

  // Try to derive human-readable names from the first student record if available
  const displaySubject = students.length > 0 && students[0].subjectName?.name ? students[0].subjectName.name : subjectId;
  const displayBatch = students.length > 0 && students[0].batchName?.name ? students[0].batchName.name : batchId;
  const displaySection = students.length > 0 && students[0].sectionName?.name ? students[0].sectionName.name : sectionId;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Card: {
            colorBgContainer: '#141414',
            colorBorderSecondary: '#303030'
          }
        }
      }}
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Modern Header Card */}
        <Card variant="borderless" className="shadow-lg !bg-[#1f1f1f]">
          <div className="flex md:flex-row flex-col items-start justify-between md:space-y-0 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30">
                <FiEdit className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-semibold m-0 tracking-tight">
                  Attendance Roster
                </h2>
                <p className="text-gray-400 mt-1 mb-0">Record daily attendance and SMS alerts</p>
              </div>
            </div>

            <div className="flex flex-col items-end md:items-start bg-[#141414] px-6 py-4 rounded-xl border border-gray-800">
              <div className="text-blue-400 font-bold md:text-xl text-lg flex items-center gap-2">
                <span className="text-gray-400 font-normal text-sm uppercase tracking-wider">Date</span>
                {formatNiceDate(displayDate)}
              </div>
              <div className="flex gap-4 mt-3 text-sm">
                <div className="text-gray-300"><span className="text-gray-500 mr-1">Sub:</span><span className="font-medium text-white">{displaySubject || "N/A"}</span></div>
                <div className="text-gray-300"><span className="text-gray-500 mr-1">Batch:</span><span className="font-medium text-white">{displayBatch || "N/A"}</span></div>
                <div className="text-gray-300"><span className="text-gray-500 mr-1">Sec:</span><span className="font-medium text-white">{displaySection || "N/A"}</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Card */}
        <Card variant="borderless" className="shadow-lg !bg-[#1f1f1f]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 items-center">
              <h3 className="text-white text-lg m-0 font-medium">Student List</h3>
              <div className="flex items-center gap-2 bg-green-950/40 border border-green-800/50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400 font-medium text-sm">
                  {presentCount} Present
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="bg-[#2a2a2a] text-red-400 border border-red-900/50 hover:bg-[#3a2020] hover:text-red-300 transition-colors h-[38px] px-6 rounded-lg text-sm font-medium"
                disabled={isSubmitting}
              >
                Reset All
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all h-[38px] px-8 rounded-lg shadow-lg shadow-blue-600/20 font-medium text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : (attendanceRecordId ? "Update Attendance" : "Submit Attendance")}
              </button>
            </div>
          </div>

          <TableMain
            columns={columns}
            dataSource={students}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            className="w-full custom-table attendance-table"
            loading={loading}
          />
        </Card>

      </div>
    </ConfigProvider>
  );
};

export default FilterTakeAttendance;