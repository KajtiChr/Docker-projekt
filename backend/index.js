const url = require('url');
const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PostgreSQL Database!'));

pgClient.query('CREATE TABLE IF NOT EXISTS wyniki(' + 'pierwszy_ulamek VARCHAR (9), ' + 'drugi_ulamek VARCHAR (9), ' + 'ulamek_wynikowy VARCHAR (11)').catch(err => console.log(err));
	
app.get('/:lic1/:lic2/:mian1/:mian2', (req, resp) => {

    // Parametry
    var licznik1 = req.params.lic1;
    var licznik2 = req.params.lic2;
    var mianownik1 = req.params.mian1;
    var mianownik2 = req.params.mian2;

    var redis_key = licznik1+licznik2+mianownik1+mianownik2;

    redisClient.get(redis_key, (err, result) => {
        if (result)
        {
            console.log("[REDIS] Getting result from cache...");
            resp.send(result.toString().replace(".", ","));
        }
        else
            {
                var licznik_wynik = 0;
		var mianownik_wynik = 0;
                var pierwszy_ulamek = licznik1.toString() + '/' + mianownik1.toString();
                var drugi_ulamek = licznik2.toString() + '/' + mianownik2.toString();

                licznik_wynik = getValue(licznik1, mianownik2) + getValue(licznik2, mianownik1);
                mianownik_wynik = getValue(mianownik1, mianownik2);
                var wynikowy_ulamek = licznik_wynik.toString() + '/' + mianownik_wynik.toString();

                var query_string = "INSERT INTO wyniki (pierwszy_ulamek, drugi_ulamek, wynikowy_ulamek) " + "VALUES ('" + pierwszy_ulamek + "', '" + drugi_ulamek + "', '" + wynikowy_ulamek + "');";
                console.log("[PostgreSQL] Executing query...");
                console.log("[PostgreSQL] " + query_string);

                pgClient.query(query_string).catch(err => console.log(err));

                console.log("[REDIS] Inserting key-value...");
                console.log("[REDIS]" + redis_key + " ==> " + wynikowy_ulamek);
                redisClient.set(redis_key, wynikowy_ulamek);

                
                resp.send(wynikowy_ulamek);
            }
    });
});

app.get('/', (req, resp) => {
    resp.send('Hello from backend');
});


app.listen(4000, err => {
    console.log('Server is listening on port 4000');
});

const getValue = (a, b) => {
    return a*b;
};
