import { hash } from "bcryptjs"

export const saltAndHashPassword = (password: string) => {

  return hash(password, 10);
}