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
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.createdBy",
          to: "users.id",
          modify: (query) => query.select("id", "firstName", "lastName"),
        },
      },
      modified: {
        relation: BaseModel.HasManyRelation,
        modelClass: UserModel,
        join: {
          from: "pages.modifiedBy",
          to: "users.id",
        },
      },
    }
  }
}

export default PageModel
