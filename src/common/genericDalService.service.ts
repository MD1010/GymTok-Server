import { Injectable } from "@nestjs/common";
import { Model, Document, FilterQuery } from "mongoose";

export abstract class GenericDalService<T extends Document> {
    constructor(
        private readonly model: Model<T>
    ) { }

    async findAll() {
        return this.model.find();
    }

    async addEntity(entity: T) {
        const createdEntity = new this.model(entity);

        return createdEntity.save();
    }

    async findByIds(ids: string[]) {
        return this.model.find({ _id: { $in: ids } } as unknown as FilterQuery<T>);
    }

    async findById(id) {
        return this.model.findOne({ _id: id });
    }

}
