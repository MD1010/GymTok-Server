import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/allExceptionsFilter";
import { LinkPredictionController } from "./linkPrediction/linkPrediction.controller";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  const linkPredictionController = app.get(LinkPredictionController);
  // linkPredictionController.initModelTraining();

  const options = new DocumentBuilder()
    .setTitle("GymTok server - until when???")
    .setDescription("Best API ever")
    .setVersion("3.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
