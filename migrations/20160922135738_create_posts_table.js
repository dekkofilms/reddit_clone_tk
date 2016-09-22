
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('posts', function (table) {
    table.increments();
    table.string('post_content');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
