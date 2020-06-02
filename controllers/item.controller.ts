
import { IItem } from "../interfaces/item.interface.ts";
import { IContext } from "../interfaces/context.interface.ts";


let items: Array<IItem> = [
    { id: '1', title: 'First', isComplete: true },
    { id: '2', title: 'Second', isComplete: false },
    { id: '3', title: 'Third', isComplete: true }
];


export const getItems = ({ response }: IContext) => {
    response.status = 200;
    response.body = {
        items
    };
}


export const getItem = ({ response, params }: IContext) => {
    const item: IItem | undefined = items.find(item => item.id === params.id);
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
        items.push(item);
        response.body = {
            item
        }
    }
}


export const updateItem = async ({ response, request, params }: IContext) => {
    const index: number | undefined = items.findIndex(item => item.id === params.id);

    if (index) {
        const body = await request.body();
        items[index] = { ...items[index], ...body.value };
        response.status = 200;
        response.body = items[index]

    } else {
        response.status = 404;
        response.body = {
            message: 'Item not found'
        }
    }
}


export const deleteItem = ({ response, params }: IContext) => {
    items = items.filter(item => item.id !== params.id);
    response.status = 200;
    response.body = { items };
}