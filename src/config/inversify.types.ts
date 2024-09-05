const TYPES = {
  Knex: Symbol.for("Knex"),
  UserRepo: Symbol.for("UserRepo"),
  UserService: Symbol.for("UserService"),
  PostRepo: Symbol.for("PostRepo"),
  PostService: Symbol.for("PostService"),
  PostUpdateRepo: Symbol.for("PostUpdateRepo"),
  TokenStore: Symbol.for("TokenStore")
};

export default TYPES;
