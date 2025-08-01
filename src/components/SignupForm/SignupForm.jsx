import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const passwordRequirements = [
  { label: "At least 12 characters", test: (pw) => pw.length >= 12 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One digit", test: (pw) => /\d/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    passwordConf: "",
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
  });

  const passwordChecks = passwordRequirements.map((req) =>
    req.test(formData.password)
  );
  const passwordValid = passwordChecks.every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const errors = {
    firstname:
      !formData.firstname && touched.firstname ? "First name required" : "",
    lastname:
      !formData.lastname && touched.lastname ? "Last name required" : "",
    email: !formData.email && touched.email ? "Email required" : "",
    username: !formData.username && touched.username ? "Username required" : "",
    password:
      touched.password && !passwordValid
        ? "Password does not meet all requirements"
        : "",
    passwordConf:
      touched.passwordConf && !formData.passwordConf
        ? "Confirm your password"
        : touched.passwordConf && formData.password !== formData.passwordConf
        ? "Passwords do not match"
        : "",
    securityQuestion1:
      !formData.securityQuestion1 && touched.securityQuestion1
        ? "Select a question"
        : "",
    securityAnswer1:
      !formData.securityAnswer1 && touched.securityAnswer1
        ? "Answer required"
        : "",
    securityQuestion2:
      !formData.securityQuestion2 && touched.securityQuestion2
        ? "Select a question"
        : "",
    securityAnswer2:
      !formData.securityAnswer2 && touched.securityAnswer2
        ? "Answer required"
        : "",
    securityDuplicate:
      formData.securityQuestion1 &&
      formData.securityQuestion2 &&
      formData.securityQuestion1 === formData.securityQuestion2
        ? "Questions must be different"
        : "",
  };

  const isUserInfoInvalid = () =>
    !(
      formData.firstname &&
      formData.lastname &&
      formData.email &&
      formData.username &&
      formData.password &&
      passwordValid &&
      formData.passwordConf &&
      formData.password === formData.passwordConf
    );

  const isSecurityInvalid = () =>
    !(
      formData.securityQuestion1 &&
      formData.securityAnswer1 &&
      formData.securityQuestion2 &&
      formData.securityAnswer2 &&
      formData.securityQuestion1 !== formData.securityQuestion2
    );

  const handleNext = (e) => {
    e.preventDefault();
    setTouched((prev) => ({
      ...prev,
      firstname: true,
      lastname: true,
      email: true,
      username: true,
      password: true,
      passwordConf: true,
    }));
    if (!isUserInfoInvalid()) {
      setStep(2);
      setMessage("");
    } else {
      setMessage("Please fix the highlighted fields before continuing.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched((prev) => ({
      ...prev,
      securityQuestion1: true,
      securityAnswer1: true,
      securityQuestion2: true,
      securityAnswer2: true,
    }));
    if (!isSecurityInvalid()) {
      try {
        await authService.signup(formData);
        setMessage("Account successfully created! Redirecting to sign in...");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          username: "",
          password: "",
          passwordConf: "",
          securityQuestion1: "",
          securityAnswer1: "",
          securityQuestion2: "",
          securityAnswer2: "",
        });
        setTimeout(() => {
          navigate("/signin");
        }, 2000); // 2 seconds before redirect
      } catch (err) {
        setMessage(err.message);
      }
    } else {
      setMessage("Please fix the highlighted security question fields.");
    }
  };


  return (
    <div className="flex bg-cream min-h-screen justify-center items-center font-albert">
      <div className="flex w-full max-w-screen-lg z-20 justify-center items-center">
        {/* Form container */}
        <div className="bg-white rounded-xl px-8 py-12 mt-8 w-full sm:w-3/5 z-20 shadow-lg flex justify-center items-center">
          {/* Form section */}
          <div className="w-full sm:w-full pl-8 h-[750px] overflow-auto">
            {/* HEADER */}
            <h2 className="text-5xl font-bold mb-8 text-center" style={{ color: "#7AA58C" }}>
              Create an Account
            </h2>
            {message && <p className="text-red-600 mb-2">{message}</p>}

            {step === 1 ? (
              <form onSubmit={handleNext}>
                {/* First Name and Last Name */}
                <div className="mb-4">
                  <label className="mb-2 font-semibold text-lg" htmlFor="firstname">
                    Firstname:
                  </label>
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.firstname && "border-red-500"
                    }`}
                    type="text"
                    id="firstname"
                    value={formData.firstname}
                    name="firstname"
                    onChange={handleChange}
                  />
                  {errors.firstname && (
                    <p className="text-xs text-red-500 mb-2">{errors.firstname}</p>
                  )}
                  <label className="mb-2 font-semibold text-lg" htmlFor="lastname">
                    Lastname:
                  </label>
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.lastname && "border-red-500"
                    }`}
                    type="text"
                    id="lastname"
                    value={formData.lastname}
                    name="lastname"
                    onChange={handleChange}
                  />
                  {errors.lastname && (
                    <p className="text-xs text-red-500 mb-2">{errors.lastname}</p>
                  )}
                </div>
                {/* Email and Username */}
                <div className="mb-4">
                  <label className="mb-2 font-semibold text-lg" htmlFor="email">
                    Email:
                  </label>
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.email && "border-red-500"
                    }`}
                    type="email"
                    id="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mb-2">{errors.email}</p>
                  )}
                  <label className="mb-2 font-semibold text-lg" htmlFor="username">
                    Username:
                  </label>
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.username && "border-red-500"
                    }`}
                    type="text"
                    id="username"
                    value={formData.username}
                    name="username"
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 mb-2">{errors.username}</p>
                  )}
                </div>
                {/* Password and Confirm Password side-by-side */}
                <div className="mb-4 flex gap-6">
                  <div className="w-1/2">
                    <label className="mb-2 font-semibold text-lg" htmlFor="password">
                      Password:
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-4 mb-1 border rounded-lg pr-16 ${
                          errors.password && "border-red-500"
                        }`}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-sage underline focus:outline-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="mb-2 font-semibold text-lg" htmlFor="confirm">
                      Confirm Password:
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-4 mb-1 border rounded-lg pr-16 ${
                          errors.passwordConf && "border-red-500"
                        }`}
                        type={showPassword ? "text" : "password"}
                        id="confirm"
                        value={formData.passwordConf}
                        name="passwordConf"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Checklist goes below the confirm password */}
                <ul className="flex flex-wrap gap-4 mt-2 text-xs">
                  {passwordRequirements.map((req, i) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-1 ${
                        passwordChecks[i]
                          ? "text-green-700 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          passwordChecks[i] ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      {req.label}
                    </li>
                  ))}
                </ul>
                {errors.password && (
                  <p className="text-xs text-red-500 mb-2">{errors.password}</p>
                )}
                {errors.passwordConf && (
                  <p className="text-xs text-red-500 mb-2">
                    {errors.passwordConf}
                  </p>
                )}
                {/* Buttons */}
                <div className="flex w-full gap-2 mt-6">
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-none bg-sage text-white hover:bg-gradient-to-r hover:from-sage hover:to-darksage"
                  >
                    Next
                  </button>
                  <Link
                    to="/"
                    className="w-1/2 py-3 rounded-none bg-redorange text-white flex items-center justify-center hover:bg-gradient-to-r hover:from-redorange hover:to-red-400"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Security Questions */}
                <div className="mb-4">
                  <label className="mb-2 font-semibold text-lg" htmlFor="securityQuestion1">
                    Security Question 1:
                  </label>
                  <select
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.securityQuestion1 && "border-red-500"
                    }`}
                    id="securityQuestion1"
                    name="securityQuestion1"
                    value={formData.securityQuestion1}
                    onChange={handleChange}
                  >
                    <option value="">Select a question</option>
                    <option value="What was the name of your first pet?">
                      What was the name of your first pet?
                    </option>
                    <option value="What is your mother’s maiden name?">
                      What is your mother’s maiden name?
                    </option>
                    <option value="What is your favorite color?">
                      What is your favorite color?
                    </option>
                    <option value="In what city or town did your parents meet?">
                      In what city or town did your parents meet?
                    </option>
                    <option value="What was your favorite food as a child?">
                      What was your favorite food as a child?
                    </option>
                  </select>
                  {errors.securityQuestion1 && (
                    <p className="text-xs text-red-500 mb-2">{errors.securityQuestion1}</p>
                  )}
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.securityAnswer1 && "border-red-500"
                    }`}
                    type="text"
                    id="securityAnswer1"
                    placeholder="Answer"
                    name="securityAnswer1"
                    value={formData.securityAnswer1}
                    onChange={handleChange}
                  />
                  {errors.securityAnswer1 && (
                    <p className="text-xs text-red-500 mb-2">{errors.securityAnswer1}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-2 font-semibold text-lg" htmlFor="securityQuestion2">
                    Security Question 2:
                  </label>
                  <select
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.securityQuestion2 && "border-red-500"
                    }`}
                    id="securityQuestion2"
                    name="securityQuestion2"
                    value={formData.securityQuestion2}
                    onChange={handleChange}
                  >
                    <option value="">Select a question</option>
                    <option value="What city were you born in?">
                      What city were you born in?
                    </option>
                    <option value="What was the model of your first car?">
                      What was the model of your first car?
                    </option>
                    <option value="What was your childhood nickname?">
                      What was your childhood nickname?
                    </option>
                    <option value="What is the name of the company of your first job?">
                      What is the name of the company of your first job?
                    </option>
                    <option value="What was the first concert you attended?">
                      What was the first concert you attended?
                    </option>
                  </select>
                  {errors.securityQuestion2 && (
                    <p className="text-xs text-red-500 mb-2">{errors.securityQuestion2}</p>
                  )}
                  <input
                    className={`w-full h-12 px-4 mb-1 border rounded-lg ${
                      errors.securityAnswer2 && "border-red-500"
                    }`}
                    type="text"
                    id="securityAnswer2"
                    placeholder="Answer"
                    name="securityAnswer2"
                    value={formData.securityAnswer2}
                    onChange={handleChange}
                  />
                  {errors.securityAnswer2 && (
                    <p className="text-xs text-red-500 mb-2">{errors.securityAnswer2}</p>
                  )}
                  {errors.securityDuplicate && (
                    <p className="text-xs text-red-500 mb-2">{errors.securityDuplicate}</p>
                  )}
                </div>
                <div className="flex w-full gap-2 mt-6">
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-none bg-sage text-white hover:bg-gradient-to-r hover:from-sage hover:to-darksage"
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    className="w-1/2 py-3 rounded-none bg-gray-400 text-white"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/signin" className="text-sage font-semibold text-lg">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
