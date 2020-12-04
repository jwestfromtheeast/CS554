import { v4 as uuidv4 } from 'uuid';
import { ObjectID } from 'mongodb';

export type Task = {
    _id: string,
    title: string,
    description: string,
    hoursEstimated: number,
    completed: boolean,
    comments: string[],
}
export type Comment = {
    comment: string
    name: string,
    _id: string,
}