import { Injectable } from "@nestjs/common";
import { Model, Document, FilterQuery } from "mongoose";

@Injectable()
export abstract class GenericService<T extends Document> {
    constructor(
        private readonly model: Model<T>
    ) { }

    async findAll() {
        return this.model.find();
    }

    async add<E>(object: E) {
        const createdObject = new this.model(object);

        return createdObject.save();
    }

    async findByIds(ids: string[]) {
        return this.model.find({ _id: { $in: ids } } as unknown as FilterQuery<T>);
    }

    async findById(id) {
        return this.model.findOne({ _id: id });
    }

}
