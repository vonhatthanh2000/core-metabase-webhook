import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CORE_SERVICE_NAME, CORE_SERVICE_PACKAGE_NAME } from 'src/protobuf/interface-ts/core-service';
import * as dotenv from 'dotenv';
import { BullModule } from '@nestjs/bull';
import { WebhookProcessor } from './webhook.processor';
import { HttpModule } from '@nestjs/axios';
dotenv.config();

const { CORE_PROTO_PATH, CORE_URL, NODE_ENV } = process.env;
const queueConfig = {
  name: `${NODE_ENV + '_'}webhook`,
};

@Module({
  imports: [
    BullModule.registerQueue(queueConfig),
    HttpModule,
    ClientsModule.register([
      {
        name: CORE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: CORE_SERVICE_PACKAGE_NAME,
          protoPath: join(process.cwd(), CORE_PROTO_PATH),
          url: CORE_URL,
        },
      },
    ]),
  ],
  providers: [WebhookProcessor],
})
export class WebhookModule {}
