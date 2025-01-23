import InputField from "./InputField";
import Button from "./Button";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../redux/actions/notificationActions";
import { useDispatch } from "react-redux";
import { loginSchema } from "../utils/validationSchemas";

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the form data
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", response.data.role);
      console.log("here here here");
      if (response.data.role === "user") {
        dispatch(fetchNotifications(response.data._id));
      }

      if (response.data.role === "admin") {
        console.log("admin it is");
        navigate("/admin/dashboard");
      } else if (response.data.role === "manager") {
        console.log("manager it is");
        navigate("/manager/dashboard");
      } else if (response.data.role === "user") {
        console.log("user it is");
        navigate("/user/dashboard");
      }
      console.log("check done");

      alert("Login successful!");
    } catch (err) {
      if (err.status === 429) {
        setError("Limit reached!");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md bg-opacity-90">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
          LOGIN
        </h2>
        <form>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button text="Login" onClick={handleLogin} />
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  setAuthToken: PropTypes.func.isRequired,
};

export default Login;
