import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validateUsername = (username: string) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  return usernameRegex.test(username);
};

const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!validateEmail(options.email)) {
    return [
      {
        field: "email",
        message: "invalid email format",
      },
    ];
  }

  if (!validateUsername(options.username)) {
    return [
      {
        field: "username",
        message: "invalid username",
      },
    ];
  }

  if (!validatePassword(options.password)) {
    return [
      {
        field: "password",
        message: "invalid password",
      },
    ];
  }

  return null;
};
