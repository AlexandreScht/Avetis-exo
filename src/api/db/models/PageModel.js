import BaseModel from "@/api/db/models/BaseModel.js"
import UserModel from "@/api/db/models/UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      Creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        filter: (query) => query.select("id", "email", "firstName", "lastName"),
        join: {
          from: "pages.createdBy",
          to: "users.id",
        },
      },
      ModifiedBy: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        filter: (query) => query.select("id", "email", "firstName", "lastName"),
        join: {
          from: "pages.modifiedBy",
          to: "users.id",
        },
      },
    }
  }
}

export default PageModel
