import UserModel from "../models/UserModel.js";

export async function getUserByEmail(email: any) {
  return await UserModel.findOne({ email }).select("+password");
}
