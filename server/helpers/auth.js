import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds to generate
    const hash = await bcrypt.hash(password, saltRounds);
    // console.log('Hashed password:', hash);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
  }
};

const comparePassword = async (pass, hashed) => {
  return await bcrypt.compare(pass, hashed);
};

export { hashPassword, comparePassword };
