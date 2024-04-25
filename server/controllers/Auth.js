import bcrypt from "bcrypt";

// register user

const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // check if any field is missing or not
    if (!username.trim() || !password.trim()) {
      throw new Error("Missing Username or Password");
    }

    /**
     * check if email is already present to not
     */

    const isAlreadyPresentUser = await User.find({ username });
    if (isAlreadyPresentUser.username) {
      throw new Error("User is already exists");
    }

    // generate hash password with round 10
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      password: hashPassword,
    });

    // before saving the user create the toke
    await user.generateAuthToken();

    // setting token as a cookie
    // res.cookie("Todo", token, { httpOnly: true });

    // create user
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    if (error.message.includes("email already exists.")) {
      error.message = "Email already exists";
    }
    next(error);
  }
};

export { registerUser };
