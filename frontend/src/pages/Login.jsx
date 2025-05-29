import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
// import BgLogin from "../assets/bglogin.jpg";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Iridescence from "../../ReactBits/Iridescence/Iridescence";

export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true); // Set loading to true

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // console.log("Login successful, cookie should be set");
        // console.log("User data:", data.user);

        // Tambahkan delay sebelum redirect (opsional)
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/mahasiswa/voting");
          }
        }, 300);
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan pada server");
    } finally {
      setIsLoggingIn(false); // Set loading to false
    }
  };

  return (
    <div>
      <Iridescence
        color={[0.7, 0.7, 0.7]}
        speed={1.5}
        amplitude={0.05}
        mouseReact={true}
        className="fixed top-0 left-0 w-full h-full z-[-1]"
      />

      <div
        className="min-h-screen flex items-center justify-center bg-center bg-no-repeat"
        // style={{
        //   backgroundImage: `url(${BgLogin})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundColor: "rgba(0, 0, 0, 0.1)",
        //   backgroundBlendMode: "overlay",
        // }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <img src={Logo} className="h-24" alt="Logo ITICM" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              Selamat Datang
            </h2>
            <p className="mt-2 text-gray-600">
              Silahkan login untuk melanjutkan
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="nim"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NIM
                </label>
                <input
                  id="nim"
                  type="text"
                  placeholder="Masukkan NIM"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn} // Disable button when loading
                className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} E-Voting
          </div>
        </div>
      </div>
    </div>
  );
}
