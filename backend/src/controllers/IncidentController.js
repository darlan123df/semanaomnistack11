const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query; // retorna uma pagina por vez

        const [count] = await connection('incidents').count();

        console.log(count);

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')// INNER JOIN da tabela ONGS com a INCIDENTS.
            .limit(5) // limita 5 registro por pagina
            .offset((page - 1) * 5) // calculo para informar de qual registro vai comerçar a proxima pagina.
            .select([
                'incidents.*', // tráz todas as informações da tabela informada.
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params; // pegando o valor da reguisição
        const ong_id = request.headers.authorization; // pega a ONG logada.

        const incident = await connection('incidents') // incidents é o nome da table que estou consultando.
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operação não permitida!' });// muda o status do http code
        }

        await connection('incidents').where('id', id).delete(); // nessa linha de comando efetuamos a exclusão do caso.

        return response.status(204).send();
    }
};