import { CredentialOptions } from "../resolvers/CredentialOptions";

export const validateRegister = (options: CredentialOptions) => {
  if (!options.email?.includes("@")) {
    return [
      {
        field: "email",
        message: "Email must be valid.",
      },
    ];
  }

  if (options.username?.length <= 2) {
    return [
      {
        field: "username",
        message: "Username must be atleast 3 characters long.",
      },
    ];
  }

  if (options.username?.includes("@")) {
    return [
      {
        field: "username",
        message: "Username must not include '@'.",
      },
    ];
  }

  if (options.password?.length <= 5) {
    return [
      {
        field: "password",
        message: "Password must be atleast 6 characters long.",
      },
    ];
  }

  return null;
};
