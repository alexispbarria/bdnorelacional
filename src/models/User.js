const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    date: {type: Date, default: Date.now}
});



// cifrando contraseña mediante el modulo bcrypt
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

// comparar contraseñas
UserSchema.methods.matchPassword = async function (password) {
    return  await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);