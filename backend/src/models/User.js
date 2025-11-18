const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Password not required for OAuth users
      return !this.googleId && !this.facebookId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  position: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  performanceMetrics: {
    tasksCompleted: {
      type: Number,
      default: 0
    },
    postsCreated: {
      type: Number,
      default: 0
    },
    interactionScore: {
      type: Number,
      default: 0
    }
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'team', 'private'],
      default: 'team'
    },
    allowMessagesFrom: {
      type: String,
      enum: ['everyone', 'team', 'nobody'],
      default: 'everyone'
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
