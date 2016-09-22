
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments();
    table.string('username');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
