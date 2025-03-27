import { Mongo } from "../database/mongo.js"
import { Collection, ObjectId } from "mongodb"
import crypto from 'crypto'

const CollectionName = 'users'

export default class UsersDataAccess {
    async getUsers() {
        const result = await Mongo.db
            .collection(CollectionName)
            .find({})
            .toArray();
        return result;
    }
    async deleteUser() {

    }

    async updateuser() {

    }
}

