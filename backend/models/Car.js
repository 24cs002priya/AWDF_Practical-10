const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({ title: { type: String, required: true, trim: true, maxlength: 120 }, brand: { type: String, trim: true, default: '' }, description: { type: String, default: '' }, price: { type: Number, required: true, min: 1 }, year: { type: Number, min: 1950, max: 2100 }, priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, completed: { type: Boolean, default: false }, owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, createdAt: { type: Date, default: Date.now } });
carSchema.pre('save', function (next) { this.title = this.title.trim(); next(); });
module.exports = mongoose.model('Car', carSchema);
