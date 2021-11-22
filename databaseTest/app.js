const express = require('express')
const mongoose = require('mongoose')
const User = require('./user');
const app = express()
const dbURI = 'mongodb+srv://AggieAuxAdmin:hellomongo@aggieaux.cbbe2.mongodb.net/AggieAux?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db'))
    .then((result) => app.listen(3000))
    .catch((err)=>console.log(err))
app.set('view engine','ejs');

function addUser(user){
    
    user.save()
        .then(result => {
            console.log("successful")
        })
        .catch(err => {
            console.log("did not work")
        })
    return user._id
}




async function getUser (socketId){
    var user = await User.findOne({ socketId: socketId})
    return user
}


// async function AddtoUserQueue (socketId,song){  
//     try{    
//     var user = await User.findOne({ socketId: socketId}, (err,res) =>{
//         res.queue.push(song)
        
//         res.save(function (err) {
//             if(err) {
//                 console.error('ERROR!');
//             }
//             //return res
//         });
//     }).clone();
//     }
//     catch(err){
//         throw err;
//     }
//     return user
// }

async function addtoqueue(socketid,song){
     await User.updateOne({socketId: socketid}, {$push: {queue: song}})
}
async function clearqueue(socketid){
    await User.updateOne({socketId: socketid}, {queue:[]})
}

async function changeUserRole(socketid,role){
    await User.updateOne({socketId: socketid}, {role: role})
}

async function changeUserRoom(socketid,roomid){
    await User.updateOne({socketId: socketid}, {roomId: roomid})
}

async function removeUser(socketid){
    await User.deleteOne({socketId: socketid})
    console.log("user removed")
}

async function clearUsers(){
    await User.deleteMany({})
    console.log("users cleared")
}







const user = new User ({
    username: "test",
    role:"member",
    queue: ['vid1','vid2'],
    socketId: "1234567",
    roomId: "10"
})

//function changeRole()
//console.log(addUser(user))
//getUser("123456").then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
//  AddtoUserQueue("123456","vid10").then((result)=>{
//      console.log("hello",result)
//      //getUser("123456").then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
//  })
//  .catch(err=>{console.log('get user error')})

socketid = "1234567"

// addtoqueue(socketid,"vid8").then(()=> {
//     getUser(socketid).then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
// })

// clearqueue(socketid).then(()=> {
//     getUser(socketid).then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
// })

// changeUserRole(socketid,"Dj").then(()=> {
//     getUser(socketid).then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
// })



// removeUser(socketid).then(()=> {
//     getUser(socketid).then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
// })

// async function final(socketid,user){
//     await addUser(user)
//     await removeUser(socketid)
//     getUser(socketid).then((result) => {/*put function here*/ console.log(result) }).catch(err=>{console.log('get user error')})
// }

// final(user.socketId,user)
//console.log(getUser("123456"))

//clearUsers()
