const session = require('express-session');

const MAX_AGE = 24 * 60 * 60 * 1000;

function createSessionModel(sequelize) {
  if (sequelize.models.Session) {
    return sequelize.models.Session;
  }

  const { DataTypes } = require('sequelize');

  return sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'sessions',
    timestamps: false
  });
}

function getExpires(sess) {
  const cookieExpires = sess.cookie && sess.cookie.expires;

  if (cookieExpires) {
    return new Date(cookieExpires);
  }

  return new Date(Date.now() + MAX_AGE);
}

module.exports = function createSessionStore(sequelize) {
  const SessionModel = createSessionModel(sequelize);
  const Store = session.Store;

  class SQLiteSessionStore extends Store {
    get(sid, callback) {
      SessionModel.findByPk(sid)
        .then((record) => {
          if (!record || record.expires <= new Date()) {
            return callback(null, null);
          }

          return callback(null, JSON.parse(record.data));
        })
        .catch(callback);
    }

    set(sid, sess, callback) {
      SessionModel.upsert({
        sid,
        expires: getExpires(sess),
        data: JSON.stringify(sess)
      })
        .then(() => callback(null))
        .catch(callback);
    }

    destroy(sid, callback) {
      SessionModel.destroy({ where: { sid } })
        .then(() => callback(null))
        .catch(callback);
    }

    touch(sid, sess, callback) {
      SessionModel.update(
        { expires: getExpires(sess) },
        { where: { sid } }
      )
        .then(() => callback(null))
        .catch(callback);
    }
  }

  return new SQLiteSessionStore();
};
