"use client";
import { Button, ConfigProvider, Form, Input, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const { Text } = Typography;

const VerifyOtp = () => {  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("resetEmail") : "";
    if (queryEmail) {
      setEmail(queryEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [searchParams]);

  const onFinish = async (values: { otp: string }) => {
    if (!email) {
      toast.error("Email not found. Please try forgot password again.");
      router.push("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetchUrl("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          oneTimeCode: Number(values.otp),
        }),
      });

      if (res?.success) {
        toast.success(res?.message || "OTP verified successfully!");
        const resetToken = res?.data;
        if (typeof window !== "undefined" && resetToken) {
          sessionStorage.setItem("resetToken", resetToken);
        }
        router.push("/reset-password");
      } else {
        toast.error(res?.message || "Failed to verify OTP");
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please try forgot password again.");
      return;
    }

    try {
      setResending(true);
      const res = await fetchUrl("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res?.success) {
        toast.success(res?.message || "A new OTP code has been sent!");
      } else {
        toast.error(res?.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[25px] font-semibold mb-2 text-white">Verification code</h1>
        <p className="text-[#ABABAB] text-sm">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="text-white font-medium">{email || "your email"}</span>. Check your inbox and enter the code below.
        </p>
      </div>

      <Form layout="vertical" className="w-full mx-auto" onFinish={onFinish}>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                controlHeight: 55,
                borderRadius: 10,
              },
            },
            token: {
              colorPrimary: "#1A5FA4",
            },
          }}
        >
          <Form.Item
            className="flex items-center justify-center mx-auto"
            name="otp"
            rules={[
              { required: true, message: "Please input 6-digit OTP code!" },
              { len: 6, message: "OTP must be 6 digits!" },
            ]}
          >
            <Input.OTP
              style={{
                width: 330,
                height: 50,
              }}
              variant="filled"
              length={6}
            />
          </Form.Item>
        </ConfigProvider>

        <div className="flex items-center justify-between mb-6 font-normal text-[#f5f4f4]">
          <Text className="text-[#ABABAB]">Didn&apos;t receive code?</Text>
          <button 
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="underline font-medium text-[#00B047] hover:text-[#00c952] cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              height: 45,
              border: "none",
              outline: "none",
              boxShadow: "none",
              background: "#1A5FA4",
              color: "white",
              fontSize: "16px",
              fontWeight: 500,
            }}
            className="hover:!bg-[#1550A0] transition-colors"
          >
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;