const {songs} = require('./seedData.js');

const {sequelize} = require('./db');
const {Song} = require('./models');


const seed = async () => {

    try {
        // drop and recreate tables per model definitions
        await sequelize.sync({ force: true });
    
        // insert data
    
        await Promise.all(songs.map(song => Song.create(song)));

        console.log("db populated!");
    } catch (error) {
        console.error(error);
    }
}

seed();
