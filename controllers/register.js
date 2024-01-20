const handleRegister = (req, res, db, bcrypt, jwt) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json("error");
  }

  const generateToken = (user) => {
    const payload = {
      username: username,
      userId: user.id,
      email: user.email
    };
    const options = {
      expiresIn: '24h'
    }
    return jwt.sign(payload, 'your_secret_key', options);
  }

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    // Insert into 'login' table
    trx.insert({
      password: hash,
      email: email,
    })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        // Insert into 'users' table
        return trx("users")
          .returning("*")
          .insert({
            username: username,
            email: loginEmail[0].email,
            password: hash,
          })
          .then((user) => {
            // Commit the transaction
            trx.commit();
            const token = generateToken(user[0])
            res.status(200).json({ user: user[0], token });
          })
          .catch((err) => {
            // Rollback the transaction on error
            if (err.code === '23505' && err.constraint === 'users_username_key') {
              // Custom error response for duplicate username
              res.status(400).json("Username already exists");
            } else if (err.code === '23505' && err.constraint === 'users_email_key') {
              // Custom error response for duplicate email
              res.status(400).json("email already exists");
            } else {
              // Other error, log and respond with a generic message
              console.error('Error during user registration:', err);
              res.status(500).json('An error occured');
            }
            trx.rollback();
          });
      })
      .catch((err) => {
        // Custom error response for duplicate email in 'login' table
        if (err.code === '23505' && err.constraint === 'login_email_key') {
          res.status(400).json("email already exists");
        } else {
          // Other error, log and respond with a generic message
          console.error('Error during login insertion:', err);
          res.status(500).json('An error occured');
        }
      });
  })
    .catch((err) => {
      // Rollback the transaction on error
      console.error('Error during transaction:', err);
      res.status(500).json('Error during registration');
    });
};

export default handleRegister;
