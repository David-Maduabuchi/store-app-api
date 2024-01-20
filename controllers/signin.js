const handleSignin = (req, res, db, bcrypt, jwt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Please fill in the required credentials at Signin");
    }
    
    const generateToken = (user) => {
        const payload = {
            userId: user.id,
            email: user.email
        };
        const options = {
            expiresIn: '24h'
        }
        return jwt.sign(payload, 'your_secret_key', options);
    }

   

    db.select('email', 'password').from('login')
        .where('email', '=', email)
        .then(data => {
            if (data.length > 0) {
                const isValid = bcrypt.compareSync(password, data[0].password);
                if (isValid) {
                    return db.select('*').from('users')
                        .where('email', '=', email)
                        .then(user => {
                            const token = generateToken(user[0])
                            res.status(200).json({ user: user[0], token }); // Include the token in the response
                        })
                        .catch(err => {
                            console.error('Error during user query:', err);
                            res.status(400).json("unable to get user");
                        });
                } else {
                    res.status(400).json("Passwords do not match");
                }
            } else {
                res.status(400).json("User not found");
            }
        })
        .catch(err => {
            console.error('Error during login query:', err);
            res.status(400).json("wrong credentials");
        });
}

export default handleSignin;
