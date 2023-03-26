import BaseModel from "@/api/db/models/BaseModel.js"
import MenuHasPageModel from "@/api/db/models/MenuHasPageModel.js"
import PageModel from "@/api/db/models/PageModel.js"

class MenuModel extends BaseModel {
  static tableName = "menus"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      childrenPage: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: PageModel,
        join: {
          from: "menus.id",
          through: {
            modelClass: MenuHasPageModel,
            from: "menus_has_pages.menuId",
            to: "menus_has_pages.childrenPage",
          },
          to: "pages.id",
        },
      },
      childrenMenu: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: MenuModel,
        join: {
          from: "menus.id",
          through: {
            modelClass: MenuHasPageModel,
            from: "menus_has_pages.menuId",
            to: "menus_has_pages.childrenMenu",
          },
          to: "menus.id",
        },
      },
    }
  }
}

export default MenuModel
