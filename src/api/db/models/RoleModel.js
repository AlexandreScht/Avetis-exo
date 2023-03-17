import BaseModel from "@/api/db/models/BaseModel.js"
import UserModel from "@/api/db/models/UserModel.js"

class RoleModel extends BaseModel {
  static tableName = "user_role"

  static relationMappings() {
    return {
      permision: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "user_role.usersId",
          to: "users.id",
        },
      },
    }
  }
}

export default RoleModel
