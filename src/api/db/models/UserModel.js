import hashPassword from "@/api/db/hashPassword.js"
import BaseModel from "@/api/db/models/BaseModel.js"
import PageModel from "@/api/db/models/PageModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.createdBy",
        },
      },
      drafts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.createdBy",
          modify: (query) => query.whereNull("publishedAt"),
        },
      },
      publishedPosts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.createdBy",
          modify: (query) => query.whereNotNull("publishedAt"),
        },
      },
      // modify: {
      //   relation: BaseModel.HasManyRelation,
      //   modelClass: PageModel,
      //   join: {
      //     from: "users.id",
      //     to: "pages.modifiedBy",
      //   },
      // },
    }
  }
  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
