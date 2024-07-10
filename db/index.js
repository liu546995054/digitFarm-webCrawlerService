module.exports = {
    db: sequelize,
    Admin: require('./skd_admin.js')(sequelize, Sequelize),
    Article: require('./skd_article.js')(sequelize, Sequelize),
    Role: require('./skd_role.js')(sequelize, Sequelize),
    Star: require('./skd_star.js')(sequelize, Sequelize),
    MysqlSessionStore: require('./_mysql_session_store.js')(sequelize, Sequelize),
}