import mongoos from "mongoose";

const userSchema = new mongoos.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    },
  },
  { timestamps: true }
);
const User = mongoos.model("User", userSchema);

export default User;
