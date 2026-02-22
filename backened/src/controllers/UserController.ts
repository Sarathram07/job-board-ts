import UserModel from "../models/UserModel.js";

export async function getUserById(id: string) {
  return await UserModel.findOne({ id });
}

export async function getUserByEmail(email: any) {
  return await UserModel.findOne({ email }).select("+password");
}
