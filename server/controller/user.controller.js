const User = require("../model/user.model"),
    mongoose = require("mongoose"),
    asyncHandler = require("express-async-handler");

const getUser = asyncHandler(async (req, res) => {
    const array = await User.find({});
    return res.json(array);
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.query;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
        const obj = await User.findById(id);
        if (obj) {
            await User.findByIdAndDelete(id);
            return res.json(obj);
        }
        return res.sendStatus(404);
    }
});

const createUser = asyncHandler(async (req, res) => {
    try {
        if (!req.body) return res.sendStatus(400);
        const { name, surname, email } = req.body;
        if (name && surname && email) {
            const user_obj = new User({ name, surname, email });
            await user_obj.save();
            return res.send(user_obj);
        }
        return res.sendStatus(400);
    } catch (error) {
        res.sendStatus(400);
    }
});

const editUser = asyncHandler(async (req, res) => {
    try {
        if (!req.body) return res.status(400);
        const { name, surname, email, _id } = req.body;
        isExist = await User.exists({ _id });

        if (!isExist) {
            res.sendStatus(404);
            return;
        }

        if (name && surname && email) {
            const user_edited = await User.findByIdAndUpdate(_id, {
                name,
                surname,
                email,
            });
            await user_edited.save();
            return res.json({ name, surname, email, _id });
        } else {
            res.status(400).send({ message: "Invalid edit data" });
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

module.exports = {
    createUser,
    deleteUser,
    getUser,
    editUser,
};
