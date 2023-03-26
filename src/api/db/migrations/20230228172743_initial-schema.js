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
    table.string("title").notNullable()
    table.text("content")
    table.string("url").notNullable().unique()
    table.integer("createdBy").references("id").inTable("users")
    table.integer("modifiedBy").references("id").inTable("users")
    table.dateTime("publishedTime")
    table.enu("status", ["draft", "published"]).notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("menus", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("menus_has_pages", (table) => {
    table.increments("id")
    table.integer("menuId").references("id").inTable("menus").notNullable()
    table.integer("childrenPage").references("id").inTable("pages")
    table.integer("childrenMenu").references("id").inTable("menus")
    table.timestamps(true, true, true)
  })
  await knex("users").insert({
    id: 1,
    email: "adminmail@gmail.com",
    passwordHash:
      "2f9ec6446b6a6e41728b2e3bed78fbc60df9992f0dbb5d7129b169954ebf3459ba8ed2eb83a9769ac4b263146cf5cc35cf9e8420918d431ae7c1df79b68887858211cb8d564a2aa91a9a719d8945fb077063eae31eef7ae91725ea66c781c53458cfd336a1a99ef7a963c6968d0772634b87c2ab62c28e2312c96fe8926fedba77422ab0795a670129b143b8b95aab0f775be1f932a33c27cb72c2d2a982593a73e1dd79cb9e5e4b892709283c885b528ca77346a3d2560c184dc70dc2e8a2258b48978418420adc591bfdd97760505947bf4276efa3ccd9bb8e40d96e8f7ffa68835c2104b1b6a1bdbace6c5d3b5161efb9825a4ac6adf1a00811b3b9810f1ef8cc46f9b36d6c8164b8c17dc2b7768bb9d2c54496b1f3a1fa996001dfed568b982667e5276c04739d1f923c77b62a4656de06496de4ff5667c19c8b0f0e8c7a8d6a24d5865070b36c1384b330b6d64acdf5ad2ae2c4bc6e748c15a9fa2b86898b664f3e41df81afe134951eef8e3b936695c02955c71f2f8e23fb2cf9a785facbf58a70d841fad638e2d707eb8dccd04f22d9a1ab170197e362632aa223caf38c578934464166da44ae176e4faf7729319f570d351fdece63cc9d3a78ef599ebea41755b50f3db8fc9983a8a035ffd5be38785b27a18e97754a44c0781f916788728cb946f219cd269a3918a3ab7a412af33b0b9f7c67ac3ba999264d9f4afd",
    passwordSalt:
      "4c6bb8ee694d905fa1a686879bba3b36462d9f372d8ed93414e0a907e39f0307cd6797fa5245577c786b4f77f5fd8cb63cca971e8bbab4cf22b65c3a1a1732384bb65a197e3d00d8d2bfe9bfcc028112bcb32decf6508169f8c439c4296dd958fcc1de11c525d387e8022a44f824683a252681f7c9b3b9ced8579bb9ded7af8a8edf9a4a0674b04e96310a98cc5a34bc47bb75a3c0ad07707d992e43a101a6ad9f2bbad16a420a001155feb252d0e4a59d8b4f8bc4a23f65f8980ff87cbb16f65e7e7bb169ad25db41e8455a93bfaf7a3fc9f047d52a1b23053c3845e5850d6a2f0489eb1523c42977cc21629aba5c3be0f436621a4d58272bc9939281e5b912c49aa7c571280ebf5a91b1b7145cd0c0d14b9d203b650290b4a746d8a0c0fd90019202a8a72e11f8aaeaf93767f4b177f29c8b699bca85718a1bfe45eeb9a9bd147ab577ac5d9b0ae61c2a4de31670b628dbe27696481bdf2be4059007147036d18173fc1e6a73e77a392b3f9d3d6cd6cd065490388bb06a9c6a06eda988912d32e8287c8e34caea97ad054c79a4f17a393a12de0497dab7f54d013a491750673fb385adf32fc916ac498162d28a784245ad8458b0cc40e0cb9d2ac151e5c7e9a9cbef84ac43765ce8f7c979c44c5b1a45b37438cc271381c56e89fd83fa4cc1141220ad7a64726b0ccdf389125d352c9f77da26aea2a78fe3668fd5ed8c751b",
    firstName: "Alexandre",
    lastName: "Admin",
  })
  await knex("user_role").insert({
    id: 1,
    usersId: 1,
    role: "admin",
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("menus_has_pages")
  await knex.schema.dropTable("menus")
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("user_role")
  await knex.schema.dropTable("users")
}
