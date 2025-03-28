import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";
import crypto from 'crypto'

const collectionName = 'users'

export default class UsersDataAccess {
    async getUsers() {
        const result = await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()

        return result
    }

    async deleteUser(userId) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(userId) })


        return result
    }
}


// import { Mongo } from "../database/mongo.js"
// import { Collection, ObjectId } from "mongodb"
// import crypto from 'crypto'

// const CollectionName = 'users'

// export default class UsersDataAccess {
//     async getUsers() {
//         const result = await Mongo.db
//             .collection(CollectionName)
//             .find({})
//             .toArray();
//         return result;
//     }
//     async deleteUser(userId) {
//         const result = await Mongo.db
//             .collection(CollectionName)
//             .find({})


//         return result
//     }

//     async updateuser() {

//     }
// }

// depois de colodar as informações aqui vou para o pasta routes  .findOneAndDelete({ _id: new ObjectId(userId) }) 