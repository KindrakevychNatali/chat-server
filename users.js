const { trimStr } = require('./utills');

let users = [];

const findUser = () => {
    const userName = trimStr(user.username);
    const userRoom = trimStr(user.room);

    return users.find((u) => trimStr(u.username) === userName && trimStr(u.room) === userRoom);
};

const addUser = (user) => {

    const isExist = findUser(user);

    !isExist && users.push(user);
    const currentUser = isExist || user;

    return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => users.filter((u) => u.room === room);

const removeUser = (user) => {
    const foundUser = findUser(user);

    if (foundUser) {
        users = users.filter(
            ({ room, username }) => room === foundUser.room && username !== foundUser.username
        );
    }
    return foundUser;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };

