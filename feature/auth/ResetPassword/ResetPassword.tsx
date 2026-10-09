"use client";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("resetToken") : null;

    if (!token) {
      toast.error("Session expired or invalid. Please request a new OTP.");
      router.push("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetchUrl("/auth/reset-password", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      if (res?.success) {
        toast.success(res?.message || "Password reset successfully! Please log in.");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("resetToken");
          sessionStorage.removeItem("resetEmail");
        }
        router.push("/login");
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[25px] font-semibold text-white">Reset Password</h1>
        <p className="text-[#ABABAB] text-sm mt-1">
          Please enter your new password below.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="newPassword"
          label={<p className="font-normal text-[#f5f4f4]">New Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your new Password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input.Password
            type="password"
            placeholder="Enter New password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 16 }}
          label={<p className="font-normal text-[#f5f4f4]">Confirm Password</p>}
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter Confirm password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: 500,
              fontSize: "16px",
              background: "#1A5FA4",
              marginTop: 10,
              outline: "none",
              border: "none",
            }}
            className="hover:!bg-[#1550A0] transition-colors"
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;