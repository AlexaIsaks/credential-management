const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User details
let UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRoles: {
    admin: {
      type: Boolean,
      default: false,
      required: false,
    },
    management: {
      type: Boolean,
      default: false,
      required: false,
    },
    normal: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  access: [
    {
      unit: {
        type: String,
        required: false,
      },
      divisions: {
        type: Array,
        default: [],
        required: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

// Hash password before saving into database
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

let User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
