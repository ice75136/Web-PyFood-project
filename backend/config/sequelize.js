import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'pyfood',
    'root',
    '1234',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize connection has been estabblished successfully.');
    } catch (error) {
        console.error('Unable to connect to the databbase via Sequelize:', error);
    }
};

testDbConnection();

export default sequelize;