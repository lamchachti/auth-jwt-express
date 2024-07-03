const bcrypt = require('bcrypt');

let users = []; // Lista vacía

const addUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    users.push(user);
    return user;
};

const findUser = (username) => {
    return users.find(user => user.username === username);
};

module.exports = {
    addUser,
    findUser
};
