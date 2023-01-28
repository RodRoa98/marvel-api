import { model, Schema } from 'mongoose';
import { BIT_VALUE } from '../../constants/general.constant';
import { AutoIncrement } from '../../database/mongodb';
import { IUserDocument, IUserModel } from './users.interface';

const character = {
  image: String,
  name: String,
  description: String,
  comicsQty: Number,
};

const userSchema = new Schema(
  {
    id: Number,
    email: {
      type: String,
      required: true,
    },
    password: String,
    name: String,
    lastName: String,
    phone: String,
    mobile: String,
    active: {
      type: Number,
      enum: Object.values(BIT_VALUE),
      default: BIT_VALUE.TRUE,
    }, // INFO: Needed for validation in authenticate method
    characterList: [character],
  },
  {
    collection: 'users',
    timestamps: true,
    useNestedStrict: true,
  }
);

userSchema.index({ id: 1 }, { name: 'idxUserId', unique: true });

userSchema.plugin(AutoIncrement, { id: 'usersSeq', inc_field: 'id', start_seq: 100000 });

export default model<IUserDocument, IUserModel>('User', userSchema);
