import hashPassword from "@/api/db/hashPassword.js"
import BaseModel from "@/api/db/models/BaseModel.js"
// import PageModel from "@/api/db/models/PageModel.js"
import RoleModel from "@/api/db/models/RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      role: {
        relation: BaseModel.HasOneRelation,
        modelClass: RoleModel,
        filter: (query) => query.select("role"),
        join: {
          from: "users.id",
          to: "user_role.usersId",
        },
      },
    }
  }
  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
