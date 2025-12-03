import { useState } from "react";

import Footer from "../components/Footer";

import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");

  const [studentID, setStudentID] = useState("");

  const [citEmail, setCitEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add your form submission logic here

    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-xl my-15 py-10 px-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your <br></br>UniMarket Account
        </h2>

        <p className="text-center text-gray-400 pb-10">
          Join the CIT student marketplace in a few simple steps!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}

          <label
            htmlFor="fullName"
            className="block text-gray-600 font-medium mb-1"
          >
            Full Name
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
            </span>

            <input
              type="text"
              id="fullName"
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Student ID */}

          <label
            htmlFor="studentID"
            className="block text-gray-600 font-medium mb-1"
          >
            Student ID
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-mortarboard"
                viewBox="0 0 20 20"
              >
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z" />

                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z" />
              </svg>
            </span>

            <input
              type="text"
              id="studentID"
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              placeholder="CIT12345"
              required
            />
          </div>

          {/* CIT Email */}

          <label
            htmlFor="citEmail"
            className="block text-gray-600 font-medium mb-1"
          >
            CIT Email
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-envelope"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
              </svg>
            </span>

            <input
              type="email"
              id="citEmail"
              className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
              value={citEmail}
              onChange={(e) => setCitEmail(e.target.value)}
              placeholder="john.doe@cit.edu"
              required
            />
          </div>

          {/* Password */}

          <label
            htmlFor="password"
            className="block text-gray-600 font-medium mb-1"
          >
            Password
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-lock"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
              </svg>
            </span>

            <input
              type="password"
              id="password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {/* Confirm Password */}

          <label
            htmlFor="confirmPassword"
            className="block text-gray-600 font-medium mb-1"
          >
            Confirm Password
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-lock"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
              </svg>
            </span>

            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {/* Upload School ID */}

          <div>
            <label htmlFor="file" className="block text-gray-600 font-medium">
              Upload School ID
            </label>

            <div className="mt-2 flex items-center space-x-4">
              <input
                type="file"
                id="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="file"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                Browse Files
              </label>

              <span className="text-gray-500">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}

          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" required />

              <span className="text-gray-600 text-sm">
                I agree to UniMarket&apos;s{" "}
                <a href="#" className="text-red-500">
                  Terms & Conditions
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none cursor-pointer"
          >
            Register Account
          </button>

          {/* Login Link */}

          <div className="text-center text-gray-400 mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
