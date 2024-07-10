const Sequelize = require('sequelize');
// const sequelize = new Sequelize('test', 'root', '92afadfe56d00f15', { // 换成自己的数据库名字和密码
const sequelize = new Sequelize('test', 'root', 'root', { // 换成自己的数据库名字和密码
    // host: '110.42.247.105',
    host: '192.168.1.2',
    dialect: 'mysql'
});

module.exports = {
    db: sequelize,
    Article: require('./save')(sequelize, Sequelize),
};
