import React, { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple hardcoded check for demonstration purposes
    if (username === "Shraddha@1234" && password === "Shraddha@1234") {
      localStorage.setItem("isLoggin", true);
      Swal.fire({
        icon: "success",
        text: "Login Successful",
        timer: 2000, // 2 seconds timer
        showConfirmButton: false, // Hide the confirmation button
        allowOutsideClick: false, // Disable outside click
        willClose: () => {
          navigate("/"); // Navigate to /dashboard
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Invalid username or password",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       backgroundColor:"gray"
      }}
    >
      <Paper
        style={{
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          margin: "2rem",
        }}
      >
        <div className="bg-[#322f2f] h-20">
          <div>
            <img
              className="h-20 cursor-pointer"
              src="Sraddha.png"
              alt="Sraddha"
            />
          </div>
        </div>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </div>
  );
}

export default AdminLogin;
