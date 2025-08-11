const express = require('express')
const app = express();

const port = 3000

const { Pool } = require('pg')

const pgConfig = { 
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port : 5432

}

const pool = new Pool(pgConfig)

const redis = require('redis')
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
}) 

//Error validation
client.on('error', (error) => { 
    throw Error(error);
})

client.connect()

app.get('/products', async(req,res) => { 
    try { 
        //ambil data dari cache
        const cacheResults = await client.get('products')
        if (cacheResults == null) throw new Error('Cache is empty')
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Lookup', 'Hit from redis')
        res.send(JSON.parse(cacheResults))
    } catch (error) {
        //ambil data dari DB
        const results = await pool.query('SELECT  * FROM products')

        //simpen ke cache
        client.set('products', JSON.stringify(results.rows), {
            EX: 30
        })
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Cache-Lookup', 'Miss from redis')
        res.send(results.rows)
    }
})

app.get('/products/:id', async(req,res)=>{ 
    const { id } = req.params

    try{ 
        //Ambil data dari cache
        const cacheResults = await client.get(`products-${id}`)
        if (cacheResults == null) throw new Error('Cache is empty')
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Lookup', 'Hit from redis')
        res.send(JSON.parse(cacheResults))
    } catch (error) { 
        //ambil data dari DB
        const { rows } = await pool.query('SELECT  * FROM products')

        //simpen ke cache
        client.set(`products-${id}`, JSON.stringify(results.rows), {
            EX: 30
        })
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Cache-Lookup', 'Miss from redis')
        res.send(results.rows)
    }
})

app.post('/products', async(req,res) => { 
    try{ 
        const { name, price } = req.body
        await pool.query('INSERT INTO products (name, price) VALUES ($1, $2)', [name, price])

        //Hapus cache
        client.del('products')

        res.send('Data berhasil di insert')
    } catch (error) { 
        res.send(error.message)
    }

})

app.listen(port, ()  => { 
    console.log(`Example App listening at port ${port}`)
})