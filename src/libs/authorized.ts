import { verify } from "jsonwebtoken";

const authorized = (token: string | undefined): boolean => {
  if (!token) {
    return false;
  }

  try {
    verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return false;
  }

  return true;
};

export default authorized;
