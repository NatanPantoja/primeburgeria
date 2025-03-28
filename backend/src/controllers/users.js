import UsersDataAccess from "../dataAccess/users.js"
import { ok, serveError } from '../helpers/httpResponse.js'

export default class UserControllers {
    constructor() {
        this.dataAccess = new UsersDataAccess()
    }

    async getUsers() {
        try {
            const users = await this.dataAccess.getUsers()


            return ok(users)
        } catch (error) {
            return serveError(error)
        }
    }

    async deleteUsers(userId) {
        try {
            const result = await this.dataAccess.deleteUser()


            return ok(result)
        } catch (error) {
            return serveError(error)
        }
    }


}

