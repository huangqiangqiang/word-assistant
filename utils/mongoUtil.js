var mongoose = require('mongoose');

var WordSchema = mongoose.Schema({
  baseInfo: Object,
  create_time: String,
  expand: Object,
  query_times: String,
  text: String,
  id: String,
});

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
});

var ListSchema = mongoose.Schema({
  user_id: String,
  word_id: String,
  create_time: String,
  query_times: String,
});

// 操作model就等于操作数据库
var WordModel = mongoose.model('word', WordSchema);
var UserModel = mongoose.model('user', UserSchema);
var ListModel = mongoose.model('list', ListSchema);

module.exports = {
  word: WordModel,
  user: UserModel,
  list: ListModel,
};