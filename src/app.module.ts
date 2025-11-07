import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './infrastructure/services/security/security.module';
import { DatabaseModule } from './infrastructure/database/typeorm/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './infrastructure/config/database.config';
import appConfig from './infrastructure/config/app.config';
import corsConfig from './infrastructure/config/cors.config';
import swaggerConfig from './infrastructure/config/swagger.config';
import securityConfig from './infrastructure/config/security.config';
import { SystemMasterModule } from './modules/system-master/system-master.module';
import { RoleModule } from './modules/role/role.module';
import { UnitOfMeasureModule } from './modules/unit-of-measure/unit-of-measure.module';
import { MaterialCategoryModule } from './modules/material-category/material-category.module';
import { MaterialsModule } from './modules/material/material.module';
import { ArticleModule } from './modules/article/article.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { BomItemModule } from './modules/bom-item/bom-item.module';
import { SpkModule } from './modules/spk/spk.module';
import { SpkStageModule } from './modules/spk-stage/spk-stage.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { DeliveryNoteModule } from './modules/delivery-note/delivery-note.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MaterialStockModule } from './modules/material-stock/material-stock.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        corsConfig,
        swaggerConfig,
        securityConfig,
      ],
    }),
    SecurityModule,
    AuthModule,
    DashboardModule,
    UserModule,
    SystemMasterModule,
    RoleModule,
    VendorModule,
    UnitOfMeasureModule,
    MaterialCategoryModule,
    MaterialsModule,
    MaterialStockModule,
    ArticleModule,
    ProductVariantModule,
    BomItemModule,
    SpkModule,
    SpkStageModule,
    DeliveryNoteModule,
    DatabaseModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
