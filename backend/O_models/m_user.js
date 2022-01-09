const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		required: true,
	},
	authorizations: [String],
	// resetToken: String,
	// resetTokenExpiration: Date,
});

userSchema.methods.addGarment = function (product) {
	const cartProductIndex = this.cart.items.findIndex(cp => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity += this.cart.items[cartProductIndex].quantity;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.removeGarment = function (pId) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productId.toString() !== pId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema);
