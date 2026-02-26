//proveedores de servicio en esta caso base de datos de MySql

import { createConnection } from "mysql2/promise"

export const mysqlProvider = { //un provider recibe el nombre del provider y un callback es la ejecucion de la conexion 
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        const connection = await createConnection({
            host: 'localhost',
            port: 3306,
            user: 'admin',
            password: 'admin',
            database: 'gids6081_db'
        });

        return connection;
    }
}


/*
Creacion de base de datos de mysql workbench




*/