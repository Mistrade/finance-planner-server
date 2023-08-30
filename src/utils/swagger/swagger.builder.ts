import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  app: INestApplication<any>;
  config: Omit<OpenAPIObject, 'paths'>;
  document: any;

  constructor(app: INestApplication<any>) {
    this.app = app;
    this.config = this.createConfig();
    this.document = SwaggerModule.createDocument(this.app, this.config, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('swagger', this.app, this.document, {
      useGlobalPrefix: true,
    });
  }

  private createConfig() {
    return new DocumentBuilder().setTitle('Сервис').setDescription('Описание сервиса').setVersion('1.0').build();
  }
}
