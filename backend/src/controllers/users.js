import UsersDataAccess from "../dataAccess/users.js"
import { ok, serveError } from '../helpers/httpResponse.js'

export default class UserControllers {
    constructor() {
        this.UsersDataAccess = new UsersDataAccess()
    }

    async getUsers() {
        try {
            const users = await this.UsersDataAccess.getUsers();

            return ok(users);
        } catch (error) {
            return serveError(error);
        }
    }

}