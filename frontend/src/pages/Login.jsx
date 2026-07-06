import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await login(formData.email, formData.password);

  if (result === "admin") {
    navigate("/admin");
  } else if (result === "user") {
    navigate("/");
  }
};

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold tracking-tight text-brand-dark">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Ariya Shop
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-dark focus:outline-none focus:ring-brand-dark sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-dark focus:outline-none focus:ring-brand-dark sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
            >
              Log in
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:text-brand-dark hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;