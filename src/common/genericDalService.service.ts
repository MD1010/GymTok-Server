import { Model, Document, FilterQuery } from "mongoose";

export class GenericDalService<T extends Document> {
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
        return this.model.where('_id').in(ids).exec();
    }

    async findById(id) {
        return this.model.findOne({ _id: id }).exec();
    }

    async findPropertyWithSpecificValue(property: string, value: any) {
        return this.model.findOne({ [property]: value } as FilterQuery<T>);
    }

}
