const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const User = require("../model/auth.model");

exports.register = async (req, res) => {
    const { fullname, email, password } = req.body;

    // Validation
    if (!fullname || !email || !password) {
        return res.status(400).json({
            message: "Please fill all the fields",
        });
    }

    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        // Save user to DB
        await newUser.save();

        // Generate token after save
        const token = await generateToken(newUser._id);

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Response (don’t expose password)
        res.status(201).json({
            message: "Registration successful.",
            token,
            success: true,
            user: newUser

        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
            success: false
        });
    }
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please register first.', success: false });

        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        const token = await generateToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: 'Login successful.',
            token,
            success: true,
            user
        });


    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login.',
            success: false
        });
    }
}

exports.getUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const isUser = await User.findById(userId).select("-password");

        if (!isUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User found.',
            success: true,
            user: isUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error during login.',
            success: false
        });
    }
}

exports.logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Server error during logout',
            success: false
        });
    }
};