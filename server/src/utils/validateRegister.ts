import { RegisterInput } from "../resolvers/user/Register.js";

export const validateRegister = (options: RegisterInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email address",
      },
    ];
  }
  if (options.username.length < 3) {
    return [
      {
        field: "username",
        message: "Length must be at least 3",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: 'Cannot include "@"',
      },
    ];
  }
  if (options.password.length < 8) {
    return [
      {
        field: "password",
        message: "Length must be at least 8",
      },
    ];
  }
  return null;
};
