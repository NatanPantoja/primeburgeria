import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import { config } from 'dotenv'/* O .env serve para proteger as informções, como senha do usuaria e adm, que não fica visivel a imformação do bando de dados. */
import authRouter from './auth/auth.js'
import usersRouter from './routes/users.js'

config() /*Coloca o esse função para chamar o dotenv */

/*Essa é a declaração da função */
async function main() {
    const hostname = 'localhost'
    const port = 3000

    const app = express()

    const mongoConnecton = await Mongo.connect({ mongoConnectonString: process.env.MONGO_CS, mongoDbName: process.env.MONGO_DB_NAME })
    console.log(mongoConnecton)

    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'welcome To Primeburgeria'  /*vai aparacer essa mensagem quando entra no site */
        })
    })

    // Routes
    app.use('/auth', authRouter)
    app.use('/users', usersRouter)

    app.listen(port, () => {
        console.log(`Serve running on: https://${hostname}:${port}`)
    })



}

main()

// Creio que fiz algo de errado na parte de autenticação do usuario, pos nesta parte que esta dando erro
