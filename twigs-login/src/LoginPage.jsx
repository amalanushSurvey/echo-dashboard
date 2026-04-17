import { useState } from "react";
import {
  ThemeProvider,
  Box,
  Flex,
  Text,
  Heading,
  Input,
  Button,
  FormLabel,
  FormHelperText,
  Checkbox,
  Separator,
} from "@sparrowengg/twigs-react";

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Logged in as ${email}`);
    }, 1500);
  };

  return (
    <ThemeProvider>
      <Box
        css={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "$8",
          backgroundColor: "$neutral100",
        }}
      >
        <Box
          css={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "$white900",
            borderRadius: "$2xl",
            boxShadow: "$sm",
            padding: "$16",
            border: "1px solid $neutral200",
          }}
        >
          {/* Logo / Brand */}
          <Flex
            flexDirection="column"
            alignItems="center"
            css={{ marginBottom: "$10" }}
          >
            <Box
              css={{
                width: "48px",
                height: "48px",
                borderRadius: "$xl",
                backgroundColor: "$primary500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "$6",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Heading
              size="h5"
              css={{ color: "$neutral900", marginBottom: "$2" }}
            >
              Welcome back
            </Heading>
            <Text
              size="sm"
              css={{ color: "$neutral500", textAlign: "center" }}
            >
              Sign in to your account to continue
            </Text>
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <Flex flexDirection="column" css={{ gap: "$6" }}>
              {/* Email */}
              <Flex flexDirection="column" css={{ gap: "$2" }}>
                <FormLabel htmlFor="email" requiredIndicator>
                  Email address
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  errorBorder={!!errors.email}
                  size="lg"
                />
                {errors.email && (
                  <FormHelperText color="error">{errors.email}</FormHelperText>
                )}
              </Flex>

              {/* Password */}
              <Flex flexDirection="column" css={{ gap: "$2" }}>
                <Flex justifyContent="space-between" alignItems="center">
                  <FormLabel htmlFor="password" requiredIndicator>
                    Password
                  </FormLabel>
                  <Text
                    size="xs"
                    css={{
                      color: "$primary600",
                      cursor: "pointer",
                      "&:hover": {
                        color: "$primary700",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </Text>
                </Flex>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  errorBorder={!!errors.password}
                  size="lg"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: "#6b7280",
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
                {errors.password && (
                  <FormHelperText color="error">
                    {errors.password}
                  </FormHelperText>
                )}
              </Flex>

              {/* Remember me */}
              <Checkbox checked={rememberMe} onChange={setRememberMe}>
                <Text size="sm" css={{ color: "$neutral700" }}>
                  Remember me for 30 days
                </Text>
              </Checkbox>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                css={{ width: "100%" }}
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </Flex>
          </form>

          {/* Divider */}
          <Flex
            alignItems="center"
            css={{ marginTop: "$8", marginBottom: "$8", gap: "$4" }}
          >
            <Separator css={{ flex: 1 }} />
            <Text size="xs" css={{ color: "$neutral400", whiteSpace: "nowrap" }}>
              OR CONTINUE WITH
            </Text>
            <Separator css={{ flex: 1 }} />
          </Flex>

          {/* Google */}
          <Button
            variant="outline"
            color="default"
            size="lg"
            leftIcon={<GoogleIcon />}
            css={{ width: "100%" }}
          >
            Sign in with Google
          </Button>

          {/* Sign up */}
          <Flex justifyContent="center" css={{ marginTop: "$8" }}>
            <Text size="sm" css={{ color: "$neutral500" }}>
              Don&apos;t have an account?{" "}
              <Text
                as="span"
                size="sm"
                css={{
                  color: "$primary600",
                  cursor: "pointer",
                  fontWeight: "$5",
                  "&:hover": {
                    color: "$primary700",
                    textDecoration: "underline",
                  },
                }}
              >
                Sign up
              </Text>
            </Text>
          </Flex>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
