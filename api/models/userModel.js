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
        "https://www.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_39674128.htm#query=profile&position=9&from_view=keyword&track=sph&uuid=8b0be532-d841-41d8-9b1c-6da4314510e4",
    },
  },
  { timestamps: true }
);
const User = mongoos.model("User", userSchema);

export default User;
