import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.auth_token) {
      navigate("/dashboard");
    }
  });

  const [formType, setFormType] = useState("signin");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formType === "signup" &&
      formState.name &&
      formState.email &&
      formState.password
    ) {
      axios
        .post("/api/users", {
          name: formState.name,
          email: formState.email,
          password: formState.password,
        })
        .then((response) => {
          setFormState({ name: "", email: "", password: "" });
          alert(response.data.message);
          setFormType("signin");
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    } else if (formType === "signin" && formState.email && formState.password) {
      axios
        .post("/api/users/login", {
          email: formState.email,
          password: formState.password,
        })
        .then((response) => {
          setFormState({ email: "", password: "" });
          alert(response.data.message);
          localStorage.setItem("auth_token", response.data.data.token);
          localStorage.setItem("user_id", response.data.data.id);
          if (localStorage.temp_short_url) {
            window.location = localStorage.temp_short_url;
          } else {
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {formType === "signin" ? "Sign in" : "Sign up"}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <div>
              {formType === "signup" && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoComplete="name"
                  value={formState.name}
                  onChange={handleChange}
                  autoFocus
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                value={formState.email}
                onChange={handleChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                value={formState.password}
                autoComplete="current-password"
                onChange={handleChange}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {formType === "signin" ? "Sign in" : "Sign up"}
              </Button>
            </div>
            <Grid container>
              <Grid item>
                {formType === "signin" ? (
                  <Link onClick={() => setFormType("signup")} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                ) : (
                  <Link onClick={() => setFormType("signin")} variant="body2">
                    {"Already registered? Sign In"}
                  </Link>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
