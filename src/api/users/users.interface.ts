import { Document, Model } from 'mongoose';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone: string;
  mobile: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

type TUserDocument = IUser & Document;
// INFO: Add virtuals and methods
export interface IUserDocument extends TUserDocument {}

// INFO: Add statics if exists
export interface IUserModel extends Model<IUserDocument> {}
