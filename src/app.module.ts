import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'database-sqlserver-db.crcqkoqqgdtl.ap-southeast-1.rds.amazonaws.com',
      port: 1433,
      username: 'admin',
      password: 'An-24012002',
      database: 'cats',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        options: {
          encrypt: true,
          trustServerCertificate: true
        }
      }
    }),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
