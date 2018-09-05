var mysql = require('mysql');

/// mysql
var connection = mysql.createConnection({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'root',
});

connection.connect();

const databaseName = 'WordAssistant';
const wordsTabel = 'word';
const userTabel = 'user';
const historyTabel = 'history';

// 创建数据库
connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} DEFAULT CHARSET utf8 COLLATE utf8_general_ci;`, function (error, results, fields) {
  if (error) throw error;
  console.log(`created database ${databaseName} success`);
  connection.changeUser({
    database: databaseName
  }, function (err) {
    if (err) {
      console.log('error in changing database', err);
      return;
    }
    createTables();
  });
});

function createTables() {
  /**
   * id           主键
   * query        查询的内容
   * translate    查询的值
   * create_time  第一次查询的时间戳(timestamp)
   * query_times  该内容查询的次数（query times）
   * group        所属组
   * user         所属用户
   * favor        是否标记为收藏
   */
  connection.query(`CREATE TABLE IF NOT EXISTS ${wordsTabel}(
        id INT NOT NULL AUTO_INCREMENT,
        text TEXT,
        baseInfo TEXT NOT NULL,
        raw TEXT,
        PRIMARY KEY ( id )) DEFAULT CHARSET=utf8;`, function (error) {
      if (error) throw error;
      console.log(`created ${wordsTabel} table success`);
    });

  /**
   * 给word表添加 extends 字段
   */
  connection.query(`select count(*) from information_schema.columns where table_name = '${wordsTabel}' and column_name = 'extends'`, function (error, results) {
    if (error) throw error;
    if (results[0]['count(*)'] === 0) {
      connection.query(`alter table ${wordsTabel} add extends TEXT;`, function (error) {
        if (error) throw error;
        console.log(`table ${wordsTabel} add extends field success`);
      });
    }
  });

  /**
   * id           主键
   */
  connection.query(`CREATE TABLE IF NOT EXISTS ${userTabel}(
        id INT NOT NULL AUTO_INCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        PRIMARY KEY ( id )) DEFAULT CHARSET=utf8;`, function (error) {
      if (error) throw error;
      console.log(`created ${userTabel} table success`);
    });

  /**
   * user_id      用户id
   * word_id      单词id
   * create_time  创建时间
   * query_times  查询次数
   */
  connection.query(`CREATE TABLE IF NOT EXISTS ${historyTabel}(
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        word_id INT NOT NULL,
        create_time INT NOT NULL,
        query_times INT DEFAULT 0,
        PRIMARY KEY ( id )) DEFAULT CHARSET=utf8;`, function (error) {
      if (error) throw error;
      console.log(`created ${historyTabel} table success`);
    });
}

// connection.end();

module.exports = connection;
