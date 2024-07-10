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
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoos.model("User", userSchema);

export default User;
