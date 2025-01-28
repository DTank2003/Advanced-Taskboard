import InputField from "./InputField";
import Button from "./Button";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Confetti from "react-confetti";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/actions/notificationActions";
import { signupSchema } from "../utils/validationSchemas";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the form data
    const validationResult = signupSchema.safeParse(formData);
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", formData);

      setSuccess(true);

      const { token } = response.data;

      localStorage.setItem("authToken", token);

      if (response.data.role === "user") {
        dispatch(fetchNotifications(response.data._id));
      }
      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.data.role === "manager") {
          navigate("/manager/dashboard");
        } else if (response.data.role === "user") {
          navigate("/user/dashboard");
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
            SIGNUP
          </h2>
          <form>
            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <Button text="Signup" onClick={handleSignup} />
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mt-4">
              Signup successful! Redirecting...
            </p>
          )}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      {success && <Confetti />}
    </div>
  );
};

export default Signup;
