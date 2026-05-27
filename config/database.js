import { Sequelize } from 'sequelize';

const urlExternaRender = 'postgres://admin_shield:4G3tu5nIVPIlGdc5b4qbUL6lA05Lk6C8@dpg-d8bg0877f7vs73c2ajkg-a.oregon-postgres.render.com/peliculas_db_h1yj';

const sequelize = new Sequelize(urlExternaRender, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Obligatorio para conectar de forma segura con Render
    }
  },
  logging: false 
});

export default sequelize;