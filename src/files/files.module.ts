import { HttpModule, Module } from "@nestjs/common";
import { FilesService } from "./files.service";

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
