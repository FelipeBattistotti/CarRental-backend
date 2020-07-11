const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page, plate } = request.query;
        const user_id = request.headers.authorization;

        const [count] = await connection('vehicle').where('vehicle.user_id', user_id).count();

        let vehicle;

        if (page === undefined) {
            vehicle = await connection('vehicle')
                .where('vehicle.user_id', user_id)
                .andWhere('vehicle.plate', 'like' , `%${plate || ''}%`)
                .select('*');
        } else {
            vehicle = await connection('vehicle')
                .where('vehicle.user_id', user_id)
                .andWhere('vehicle.plate', 'like' , `%${plate || ''}%`)
                .limit(5)
                .offset((page - 1) * 5)
                .select('*');
        }

        response.header('X-Total-Count', count['count(*)']);

        console.log('GET vehicle - OK');

        return response.json(vehicle);
    },

    async create(request, response) {
        const { plate } = request.body;
        const user_id = request.headers.authorization;

        const [id] = await connection('vehicle').insert({
            plate,
            user_id,
        });

        console.log('CREATE vehicle - OK');

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const vehicle = await connection('vehicle')
            .where('id', id)
            .select('user_id')
            .first();

        if (vehicle === undefined) {
            console.log('DELETE vehicle - NOK');
            console.log('Product not found!');
            return response.status(401).json({ error: 'Product not found!' });
        }

        if (vehicle.user_id != user_id) {
            console.log('DELETE vehicle - NOK');
            console.log('Operation not allowed!');
            return response.status(401).json({ error: 'Operation not allowed!' });
        }

        await connection('vehicle').where('id', id).delete();

        console.log('DELETE vehicle - OK');

        return response.status(204).send();
    }
};
