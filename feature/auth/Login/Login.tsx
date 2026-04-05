"use client";
import InputField from "@/shared/InputField";
import { Checkbox, Form, Input, ConfigProvider, theme } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { fetchUrl } from "@/lib/fetchUrl";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Clear all session data on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear cookies
      const cookies = ['accessToken', 'refreshToken'];
      cookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
  }, []);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await fetchUrl("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (res.success) {
        toast.success(res.message || "Login successful!");

        // Save to localStorage for client-side easy access
        localStorage.setItem("accessToken", res.data.accessToken);

        // Save to cookies for Next.js Edge Middleware route protection
        // Cookie expires in 7 days roughly, adjust logic as needed
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `accessToken=${res.data.accessToken}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
          document.cookie = `refreshToken=${res.data.refreshToken}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
        }

        // Redirect to dashboard
        router.push("/subject-list");
      } else {
        toast.error(res.message || "Failed to login");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto p-8 rounded-2xl bg-[#1e1e24]/80 backdrop-blur-md border border-[#33333b] shadow-2xl">
      <div className=" mb-8 text-center">
        <h1 className="text-[28px] font-bold mb-2 text-white tracking-wide">
          Log in to your account
        </h1>
        <p className="text-[#11D279] md:text-[16px] text-sm font-medium">
          {" "}
          Please enter your email and password to continue
        </p>
      </div>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#1A5FA4",
            controlHeight: 48,
            borderRadius: 8,
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish} className="space-y-4">
          <InputField name={"email"} label={"Email"} />

          <Form.Item
            name="password"
            label={
              <p className="font-medium text-[#f5f4f4] text-[16px]">Password</p>
            }
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{
                outline: "none",
                boxShadow: "none",
              }}
            />
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <Form.Item
              style={{ marginBottom: 0 }}
              className="font-normal text-[#f5f4f4]"
              name="remember"
              valuePropName="checked"
            >
              <Checkbox
                defaultChecked
                className="font-normal text-[#a3a3a3] hover:text-white transition-colors"
              >
                Remember me
              </Checkbox>
            </Form.Item>

            <a
              className="login-form-forgot text-[#1A5FA4] hover:text-[#2879cd] transition-colors font-semibold"
              href="/forgot-password"
            >
              Forgot password?
            </a>
          </div>

          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] text-white text-[18px] font-medium flex items-center justify-center bg-[#1A5FA4] hover:bg-[#2879cd] transition-all rounded-lg disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(26,95,164,0.39)] hover:shadow-[0_6px_20px_rgba(26,95,164,0.23)]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Login;
