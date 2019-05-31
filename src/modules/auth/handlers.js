import uuid from 'uuid/v4';
import * as userDb from 'users/db';
import passwords from '../../services/passwords';
import config from '../../config';

export async function register(req, res) {
  const { password, fullName, email } = req.body;
  const hashFunc = config.hash.default;

  try {
    const passwordHash = await passwords.hash(hashFunc, password);
    const newUser = await userDb.createUser({
      id: uuid(),
      email,
      fullName,
      passwordHash,
      hashFunc,
    });

    const token = this.jwt.sign({
      userId: newUser.id,
      iat: Date.now(),
    });
    console.log(token);

    res.send({ token, user: newUser });
  } catch (error) {
    if (error.constraint === 'user_email_unique') {
      res.status(409).send({ error: 'email already used' });
      return;
    }

    throw error;
  }
}

export async function login(req, res) {
  const { password, email } = req.body;

  const user = await userDb.getUserByEmail(email);

  if (!user) {
    res.status(404).send({ error: 'user not found' });
    return;
  }

  const passwordMatches = await passwords.compare(
    user.passwordHashType,
    password,
    user.passwordHash.toString('utf-8'),
  );

  if (!passwordMatches) {
    res.status(401).send({ error: 'wrong password' });
    return;
  }

  const token = this.jwt.sign({
    userId: user.id,
    iat: Date.now(),
  });
  console.log(token);

  res.send({ token, user });
}
