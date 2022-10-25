import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { BullModule } from '@nestjs/bull';
import { WebhookProcessor } from './webhook.processor';
import { HttpModule } from '@nestjs/axios';
dotenv.config();

const { NODE_ENV } = process.env;
const queueConfig = {
  name: `${NODE_ENV + '_'}webhook`,
};

@Module({
  imports: [BullModule.registerQueue(queueConfig), HttpModule],
  providers: [WebhookProcessor],
})
export class WebhookModule {}
