"use client";
import InputField from "@/shared/InputField";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const ForgetPassword = () => { 
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      const res = await fetchUrl("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: values.email }),
      });

      if (res?.success) {
        toast.success(res?.message || "OTP sent to your email!");
        if (typeof window !== "undefined") {
          sessionStorage.setItem("resetEmail", values.email);
        }
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="text-[25px] font-semibold text-white">Forgot Password ?</h1>
        <p className="text-[#ABABAB] text-sm mt-1">
          Enter your registered email address to receive an OTP code.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <InputField name={"email"} label={"Email"} />

        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: 500,
              fontSize: "16px",
              marginTop: 20,
            }} 
            className="flex items-center justify-center bg-[#1A5FA4] hover:bg-[#1550A0] transition-colors rounded-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgetPassword;