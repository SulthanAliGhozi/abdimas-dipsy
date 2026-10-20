import 'dotenv/config'
import { Options } from 'sequelize'

const config: Options = {
  username: process.env.SEQUELIZE_USERNAME,
  password: process.env.SEQUELIZE_PASSWORD,
  database: process.env.SEQUELIZE_DATABASE,
  host: process.env.SEQUELIZE_HOST,
  port: Number(process.env.SEQUELIZE_PORT),
  dialect: process.env.SEQUELIZE_CONNECTION as
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mssql',
  timezone: process.env.SEQUELIZE_TIMEZONE,
}


export = config
