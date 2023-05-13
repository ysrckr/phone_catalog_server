import bycrpt from 'bcrypt';

export const hashPassword = (password: string) => {
  const hashedPassword = bycrpt.hashSync(password, 10);
  return hashedPassword;
}

export const comparePassword = (password: string, hashedPassword: string) => {
  const isValidPassword = bycrpt.compareSync(password, hashedPassword);
  return isValidPassword;
}