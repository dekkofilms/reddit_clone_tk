
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.string('post_link');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function (table) {
    table.dropColumn('post_link');
  })
};
