import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import * as admin from "firebase-admin";
// import { ServiceAccount } from "firebase-admin";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/allExceptionsFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const adminConfig: ServiceAccount = {
  //   projectId: process.env.FIREBASE_PROJECT_ID,
  //   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // };
  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  // });
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle("GymTok server - until when???")
    .setDescription("Best API ever")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
