var mysql = require('./../utils/mysql');

var tool = {
  name: 'history',
  get: function (obj, cb) {
    mysql.query(`select * from ${this.name} where user_id=${obj.user_id} and word_id=${obj.word_id}`, function (err, results) {
      cb && cb(err, results);
    });
  },
  set: function (obj, cb) {
    this.get(obj, (err, results) => {
      if (results && results.length === 0) {
        mysql.query(`insert into ${this.name} (
                    user_id,
                    word_id,
                    create_time,
                    query_times
                  ) values (
                    ${obj.user_id},
                    ${obj.word_id},
                    ${obj.create_time},
                    ${obj.query_times}
                  )`, function (err) {
            cb && cb(err);
          });
      }
      cb && cb(err);
    });

  }
};

module.exports = tool;