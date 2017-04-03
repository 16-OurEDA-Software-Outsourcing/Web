/**
 * Created by liuchaorun on 2017/3/30.
 */
const config = require('./config');
const Sequelize = require('sequelize');
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 3000
    }
});

function defineModel(name, attributes) {
    let attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.createdat = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedat = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
            if (k === 'type') {
                for (let key in Sequelize) {
                    if (key === 'ABSTRACT' || key === 'NUMBER') {
                        continue;
                    }
                    let dbType = Sequelize[key];
                    if (typeof dbType === 'function') {
                        if (v instanceof dbType) {
                            if (v._length) {
                                return `${dbType.key}(${v._length})`;
                            }
                            return dbType.key;
                        }
                        if (v === dbType) {
                            return dbType.key;
                        }
                    }
                }
            }
            return v;
        }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    obj.createdat = now;
                    obj.updatedat = now;
                    obj.version = 0;
                } else {
                    console.log('will update entity...');
                    obj.updatedat = now;
                    obj.version++;
                }
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

let exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({force: true});
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}


module.exports = exp;