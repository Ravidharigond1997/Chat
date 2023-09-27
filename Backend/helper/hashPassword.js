import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    let saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (error) {
    console.log(`error : ${error.message}`);
  }
};

export const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
