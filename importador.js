const axios = require('axios');
const sqlite = require('sqlite3');

// Conectando com o BD
const db = new sqlite.Database('./coronadb.db', erro => {
    if (erro) {
        console.log('Erro ao conectar com o banco de dadods');
    }
})

// puxar os dados da API do corona
axios.get('https://api.covid19api.com/summary')
    .then(resultado => {

        // paises é uma lista
        const paises = resultado.data.Countries;

        // deleta todos os dados da tabela
        db.run('DELETE FROM Corona', erroDelete => {
            if (erroDelete) {
                console.log('Erro ao deletar colunas: ', erroDelete);
            }
            paises.forEach(pais => {
                // inserir um pais no meu banco-corona
                db.run('INSERT INTO Corona (Country, NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [pais.Country, pais.NewConfirmed, pais.TotalConfirmed, pais.NewDeaths, pais.TotalDeaths, pais.NewRecovered, pais.TotalRecovered], erro => {
                        if (erro) {
                            console.log('Erro ao inserir dados: ', erro);
                        }
                    })
            })
        })
    })


module.exports = db