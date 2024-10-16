import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 64,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    bio: {
      type:String,
   
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },

    image: {
      url: String,
      public_id: String,
    },
    following: [{ type: Schema.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.ObjectId, ref: 'User' }],
  },
  { timestamps: true } // Set timestamps option to true
);

const User = mongoose.model('User', userSchema);
export default User;
