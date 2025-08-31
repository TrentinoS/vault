import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schemas ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },  // User's full name
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // User email
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const PasswordSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'vault-auth', required: true },
  product: { type: String, required: true },
  userId: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('vault-auth', UserSchema);
const Password = mongoose.model('vault', PasswordSchema);

// --- Authentication Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// --- API Routes ---

// Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: 'Name is required.' });
  if (!email?.trim()) return res.status(400).json({ message: 'Email is required.' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' });

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.active) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// Change password
app.put('/api/auth/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters long.' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Soft delete user account
app.delete('/api/auth', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = false;
    await user.save();

    res.json({ message: 'Account disabled' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get passwords
app.get('/api/passwords', authMiddleware, async (req, res) => {
  try {
    const passwords = await Password.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(passwords.map(p => ({
      id: p._id,
      product: p.product,
      userId: p.userId,
      password: p.password,
      createdAt: p.createdAt,
    })));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Upsert password (update if exists, else create)
app.post('/api/passwords', authMiddleware, async (req, res) => {
  const { product, userId, password } = req.body;

  try {
    let existing = await Password.findOne({ owner: req.user.id, product, userId });
    if (existing) {
      existing.password = password;
      existing.createdAt = new Date();
      await existing.save();

      return res.json({
        id: existing._id,
        product: existing.product,
        userId: existing.userId,
        password: existing.password,
        createdAt: existing.createdAt,
      });
    }

    const newPass = new Password({ owner: req.user.id, product, userId, password });
    const saved = await newPass.save();

    res.status(201).json({
      id: saved._id,
      product: saved.product,
      userId: saved.userId,
      password: saved.password,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete password
app.delete('/api/passwords/:id', authMiddleware, async (req, res) => {
  try {
    const pwd = await Password.findById(req.params.id);
    if (!pwd) return res.status(404).json({ message: 'Password not found' });

    if (pwd.owner.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await Password.findByIdAndDelete(req.params.id);

    res.json({ message: 'Password removed' });
  } catch (error) {
    console.error(error.message);

    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Password not found' });

    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('Backend server is running');
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
