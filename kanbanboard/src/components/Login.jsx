import InputField from "./InputField";
import Button from "./Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { fetchNotifications } from "../redux/actions/notificationActions";
import { loginSchema } from "../utils/validationSchemas";
import { getTitle } from "../constants/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading,
    role,
    userId,
    error: loginError,
  } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the form data
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const { role, userId } = resultAction.payload;

      if (role === "user") {
        dispatch(fetchNotifications(userId));
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "manager") {
        navigate("/manager/dashboard");
      } else if (role === "user") {
        navigate("/user/dashboard");
      }

      alert("Login successful!");
    } else {
      setError(resultAction.payload || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md bg-opacity-90">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
          {getTitle("LOGIN")}
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
          <Button text="Login" onClick={handleLogin} disabled={loading} />
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {loginError && (
          <p className="text-red-500 text-center mt-4">{loginError}</p>
        )}
        <p className="text-center text-gray-600 mt-4">
          {getTitle("NO_ACCOUNT")}
          <Link to="/signup" className="text-blue-500 hover:underline">
            {getTitle("SIGNUP")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
