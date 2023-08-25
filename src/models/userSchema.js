import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'client'],
        default: 'client'
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }],
    address: { type: String },
    // payment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    // favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
    // avatar: { type: String },
    phone: { type: String, default: "" },
    birthday: { type: Date },
    dni: { type: String, default: "" },
    age: { type: Number },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;