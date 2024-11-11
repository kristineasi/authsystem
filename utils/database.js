import * as SQLite from 'expo-sqlite';

export const initDatabase = () => {
    const db = SQLite.openDatabase('myDatabase.db');

    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT,
                firstName TEXT,
                lastName TEXT,
                email TEXT,
                contactNumber TEXT,
                address TEXT,
                profilePicture TEXT
            );`,
            [],
            () => console.log('Table created successfully'),
            (txObj, error) => console.log('Error', error)
        );
    });
};

export const registerUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase('myDatabase.db');

        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO users (username, password, firstName, lastName, email, contactNumber, address, profilePicture)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    userInfo.username,
                    userInfo.password,
                    userInfo.firstName,
                    userInfo.lastName,
                    userInfo.email,
                    userInfo.contactNumber,
                    userInfo.address,
                    userInfo.profilePicture
                ],
                () => resolve(true),
                (_, error) => reject(error)
            );
        });
    });
};


export const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase('myDatabase.db');

        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM users WHERE username = ? AND password = ?;`,
                [username, password],
                (_, { rows }) => {
                    if (rows.length > 0) resolve(true);
                    else resolve(false);
                },
                (_, error) => reject(error)
            );
        });
    });
};
