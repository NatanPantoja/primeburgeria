import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import { Mongo } from '../database/mongo.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const collectionName = 'users'

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
    const user = await Mongo.db /*vai esta verificando no bando de dados se existe esse email */
        .collection(collectionName)
        .findOne({ email: email })

    if (!user) {
        return callback(null, false)
    }

    const saltBuffer = user.salt.buffer

    // Essa será para cryptocrafa a senha do usuário 
    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => { //Os numeros são de defalt
        if (err) {
            return callback(null, false)
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer)  // Esse é o formato que o mongoDb salva 

        if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
            return callback(null, false)
        }

        const { password, salt, ...rest } = user

        return callback(null, rest)

    })

}))

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db  // Ira verificar no banco de dados se existe o usuário
        .collection(collectionName)
        .findOne({ email: req.body.email })

    if (checkUser) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: 'User already exists!'
            }
        })
    }

    const salt = crypto.randomBytes(16)

    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypto password!',
                    err: err
                }
            })
        }

        const result = await Mongo.db
            .collection(collectionName)
            .insertOne({
                email: req.body.email,
                password: hashedPassword,
                salt
            })

        if (result.insertedId) {
            const user = await Mongo.db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(result.insertedId) })

            const token = jwt.sign(user, 'secret')

            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'User resgistered correctly!',
                    token,
                    user,
                    logged: true
                }
            })
        }
    })
})

//Login
authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if (error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error during authentication',
                    error
                }
            })
        }

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: 'Senha incorreta ',

                }
            })
        }


        const token = jwt.sign(user, 'secret')
        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: 'Usuário logado',
                user,
                token

            }
        })

    })(req, res)
})

export default authRouter

// import express from 'express'
// import passport from 'passport'
// import LocalStrategy from 'passport-local'
// import crypto from 'crypto'
// import { Mongo } from '../database/mongo.js'
// import jwt from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'

// const collectionName = 'users'

// passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
//     const user = await Mongo.db /*vai esta verificando no bando de dados se existe esse email */
//         .collection(collectionName)
//         .findOne({ email: email })

//     if (!user) {
//         return callback(null, false)
//     }

//     const saltBuffer = user.salt.buffer

//     /*Essa será para cryptocrafa a senha do usuario */
//     crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
//         if (err) {
//             return callback(null, false)
//         }

//         const userPasswordBuffer = Buffer.from(user.password.buffer)

//         if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
//             return callback(null, false)
//         }

//         const { password, salt, ...rest } = user

//         return callback(null, rest)

//     })

// }))

// const authRouter = express.Router()

// authRouter.post('/signup', async (req, res) => {
//     const chekUser = await Mongo.db  // Ira verificar no banco de dados se existe o email
//         .collection(collectionName)
//         .findOne({ email: req.body.email })

//     if (chekUser) {
//         return res.status(500).send({
//             success: false,
//             statusCode: 500,
//             body: {
//                 text: 'User already exists!'
//             }
//         })
//     }

//     const salt = crypto.randomBytes(16)
//     crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
//         if (err) {
//             return res.status(500).send({
//                 success: false,
//                 statusCode: 500,
//                 body: {
//                     text: 'Error on crypto password!'
//                 }
//             })
//         }

//         const result = await Mongo.db
//             .collection(collectionName)
//             .insertOne({
//                 email: req.body.email,
//                 password: hashedPassword,
//                 salt
//             })

//         if (result.insertedId) {
//             const user = await Mongo.db
//                 .collection(collectionName)
//                 .findOne({ _id: new ObjectId(result.insertedId) })

//             const token = jwt.sign(user, 'secret')

//             return res.send({
//                 success: true,
//                 statusCode: 200,
//                 body: {
//                     text: 'User resgistered correctly!',
//                     token,
//                     user,
//                     logged: true
//                 }
//             })
//         }
//     })
// })

// //Login
// authRouter.post('/login', (req, res) => {
//     passport.authenticate('local', (erro, user) => {
//         if (erro) {
//             return res.status(500).send({
//                 success: false,
//                 statusCode: 500,
//                 body: {
//                     text: 'Error during authentication',
//                     error
//                 }
//             })
//         }

//         if (!user) {
//             return res.status(500).send({
//                 success: false,
//                 statusCode: 500,
//                 body: {
//                     text: 'User not found',

//                 }
//             })
//         }


//         const token = jwt.sign(user, 'secret')
//         return res.status(200).send({
//             success: true,
//             statusCode: 200,
//             body: {
//                 text: 'User logged in correctly',
//                 user,
//                 token

//             }
//         })

//     })(req, res)
// })

// export default authRouter