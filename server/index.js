require('dotenv').config();
const mongoose = require('mongoose'),
    express = require('express'),
    cors = require('cors'),
    mongo_url = process.env.MONGO_URL,
    port = process.env.PORT;

const User = require('../model/user.model');

const app = express();


app.use(cors())
app.use(express.json());



async function main(){
    try{
        await mongoose.connect(mongo_url)
            .then(() => console.log('DB connected'));

        app.listen(port, () => {
            console.log(`Server is up on port: ${port}`)
        })
    }catch(error){
        console.log(error.message)
    }
}


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

app.get('/api/users', async (req, res) => {

    const {id} = req.query;

    if(id && mongoose.Types.ObjectId.isValid(id)){
        const obj = await User.findById(id);

        if(obj){
            return res.json({data: obj});
        }

        return res.sendStatus(404);
    }

    const array = await User.find({});
    return res.json({data: array})
})



app.delete('/api/users', async (req, res) => {

    const {id} = req.query;

    if (id && mongoose.Types.ObjectId.isValid(id)){
        const obj = await User.findById(id);

        if (obj) {
            await User.findByIdAndDelete(id);
            return res.json({data: obj})
        }

        return res.sendStatus(404);
    }

//     const array = await User.find({});
        
//     for (let elem of array){
//         await User.findByIdAndDelete(elem._id);
//     }    

//     // (await User.find({})).map(async (el) => {
//     //     await User.findByIdAndDelete(el._id)
//     // })

//     // await User.deleteMany({})
    
//     return res.sendStatus(200);
})

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


main();
