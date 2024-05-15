require("dotenv").config();
const mongoose = require("mongoose"),
    express = require("express"),
    cors = require("cors"),
    mongo_url = process.env.MONGO_URL,
    port = process.env.PORT;

const User = require("../model/user.model");

const app = express();

app.use(cors());
app.use(express.json());

async function main() {
    try {
        await mongoose
            .connect(mongo_url)
            .then(() => console.log("DB connected"));

        app.listen(port, () => {
            console.log(`Server is up on port: ${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
}

app.get("/api/users", async (req, res) => {
    const array = await User.find({});
    return res.json(array);
});

app.delete("/api/users", async (req, res) => {
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

app.post("/api/users", async (req, res) => {
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

app.put("/api/users", async (req, res) => {
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
            return res.json({name, surname, email, _id});
        } else {
            res.status(400).send({ message: "Invalid edit data" });
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

main();

// app.put('/api/users', async (req, res) => {

//     const {id, name, surname, email, age} = req.query;

//     if (id && mongoose.Types.ObjectId.isValid(id)){
//         const obj = await User.findById(id);

//         if (obj) {
//             // User.findByIdAndUpdate(id, {})
//             // await User.findByIdAndDelete(id);
//             return res.json({data: obj})
//         }

//         return res.sendStatus(404);
//     }

//     return res.sendStatus(200);
// })

// app.post('/api/users', async (req, res) => {
//     try{
//         if(!req.body) return res.sendStatus(400);

//         const {name, surname, email, age} = req.body;

//         if(name && surname && email){
//             const user_obj = new User({
//                 name, surname, email, age: age ?? 0
//             });

//             await user_obj.save();

//             return res.send(user_obj);
//         }

//         return res.sendStatus(400)
//     }catch(error){
//         res.sendStatus(400)
//     }
// })
