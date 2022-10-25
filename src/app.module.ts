import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
          },
        };
        if (configService.get('REDIS_USERNAME'))
          config['redis'] = Object.assign(config['redis'], {
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
          });

        return config;
      },
      inject: [ConfigService],
    }),
    WebhookModule,
  ],
})
export class AppModule {}
