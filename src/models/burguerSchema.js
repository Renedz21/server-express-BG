import mongoose from "mongoose";

const burguerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    ingredients: { type: [String], required: true },
    description: { type: String, required: true },
    //category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    available: { type: Boolean, default: true },
    quantitySold: { type: Number, default: 0 },

}, { timestamps: true });

const Burguer = mongoose.model('Burguer', burguerSchema);

export default Burguer;