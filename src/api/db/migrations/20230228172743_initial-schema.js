export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.string("firstName").notNullable()
    table.string("lastName").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("user_role", (table) => {
    table.increments("id")
    table.integer("usersId").references("id").inTable("users").notNullable()
    table.enu("role", ["admin", "manager", "editor"]).notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content")
    table.string("url").notNullable().unique()
    table.integer("createdBy").references("id").inTable("users").notNullable()
    table.integer("modifiedBy").references("id").inTable("users")
    table.datetime("publishedAt")
    table.string("status").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("menus", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    // pas sur de ce champ
    table
      .integer("Hierarchical")
      .references("id")
      .inTable("pages")
      .notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("menus")
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("user_role")
  await knex.schema.dropTable("users")
}
