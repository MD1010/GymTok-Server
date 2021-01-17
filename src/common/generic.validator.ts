import { Injectable, NotFoundException } from "@nestjs/common";
import { Document } from "mongoose";
import { BasicDto } from "./basic.dto";
import { GenericDalService } from "./genericDalService.service";

@Injectable()
export class GenericValidator<T extends Document, D extends BasicDto> {
  constructor(private entityService: GenericDalService<T, D>) { }

  async getOrThrowErrorIfOneOfEntityIdsIsNotExist(entityIds: string[]) {
    const entities = await this.entityService.findByIds(entityIds);
    if (entities.length !== entityIds.length) {
      throw new NotFoundException(`At least one of the ids ${JSON.stringify(entityIds)} is not exist`);
    }

    return entities;
  }

  async throwErrorIfChallengeIdIsNotExist(entityId: string) {
    const entity = await this.entityService.findById(entityId);
    if (!entity) {
      throw new NotFoundException(`The id ${entityId} is not exist`);
    }
  }
}
