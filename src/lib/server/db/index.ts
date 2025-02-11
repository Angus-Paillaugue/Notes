import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export class Database {
  static #connection: ReturnType<typeof mysql.createConnection>;

  constructor() {
    Database.#connection = mysql.createConnection({
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      host: env.NODE_ENV === 'production' ?  env.MYSQL_HOST : 'localhost',
      database: env.MYSQL_DATABASE,
      connectionLimit: 10,
      waitForConnections: true,
      debug: false,
      multipleStatements: true,
      timezone: 'Z'
    });
  }


  static async getConnection() {
    if(!Database.#connection) {
      new Database();
    }
    return await Database.#connection;
  }
}
