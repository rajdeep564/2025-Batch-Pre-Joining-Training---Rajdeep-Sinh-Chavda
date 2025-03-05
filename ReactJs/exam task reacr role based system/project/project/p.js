import bcrypt from 'bcryptjs';


const password = 'admin@123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log('Hashed password:', hash);
}).catch((err) => {
  console.error(err);
});

