
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('comments', function (table) {
    table.increments();
    table.string('comment_content');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.integer('post_id').unsigned();
    table.foreign('post_id').references('posts.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments');
};
