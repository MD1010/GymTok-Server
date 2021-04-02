import { Model, Document, FilterQuery } from "mongoose";
import { BasicEntityDto } from "./basicEntity.dto";

export class GenericDalService<T extends Document, D extends BasicEntityDto = any> {
  constructor(private readonly model: Model<T>) {}

  async findAll() {
    return this.model.find();
  }

  async createEntity(entity: D) {
    const createdEntity = new this.model(entity);
    return createdEntity.save();
  }

  async findByIds(ids: string[]) {
    return this.model.where("_id").in(ids).exec();
  }

  async findById(id) {
    return this.model.findOne({ _id: id }).exec();
  }

  async findWithFilter(filter: { [key: string]: any }) {
    return this.model.find(filter as FilterQuery<T>);
  }
}
