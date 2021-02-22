import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { GridFsMulterConfigService } from "./multer-config.service";

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [],
  providers: [GridFsMulterConfigService, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
