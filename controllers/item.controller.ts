import { Client } from "../dependencies.ts";
import { settings } from "../db.settings.ts";
import { IItem } from "../interfaces/item.interface.ts";
import { IContext } from "../interfaces/context.interface.ts";


const client = await new Client().connect(settings);


export const getItems = async ({ response }: IContext) => {
    response.status = 200;
    const items: Array<IItem> = await client.query(`select * from items`);
    response.body = {
        items
    };
}


export const getItem = async ({ response, params }: IContext) => {
    const item: IItem | undefined = await client.query(`select * from items where id = ?`, [params.id]);
    if (item) {
        response.status = 200;
        response.body = {
            item
        }
    } else {
        response.status = 404;
        response.body = {
            message: 'Item not found'
        }
    }
}


export const createItem = async ({ response, request }: IContext) => {
    const body = await request.body();

    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            message: 'Invalid input data'
        }
    } else {
        response.status = 201;
        const item: IItem = body.value;
        item.id = Date.now().toString();
        
        await client.execute(`INSERT INTO items(id, title, completed) values(?, ?, ?)`, [
            item.id,
            item.title,
            item.completed
        ]);
        response.body = {
            item
        }
    }
}


export const updateItem = async ({ response, request, params }: IContext) => {
    const body = await request.body();

    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            message: 'Invalid input data'
        }
    } else {
        response.status = 200;
        const item: IItem = body.value;
        const query = `update items set ${item.title ? 'title = ?,' : ''} ${item.completed ? 'completed = ?' : ''} where id = ?`;
        await client.execute(query, [item.title, item.completed, params.id].filter(Boolean))
            .catch(err => {
                console.log(err);
            });
        response.body = {
            message: 'Item successfully updated'
        }
    }
}


export const deleteItem = async ({ response, params }: IContext) => {
    const deleted = await client.execute(`delete from items where id = ?`, [params.id]);
    if (deleted.affectedRows) {
        response.status = 200;
        response.body = {
            message: 'Item successfully deleted'
        }
    } else {
        response.status = 404;
        response.body = {
            message: 'Item not found'
        }
    }
}