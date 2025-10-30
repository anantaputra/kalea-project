import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import {
  CreateVendorUseCase,
  UpdateVendorUseCase,
  FindAllVendorUseCase,
  FindVendorByIdUseCase,
  DeleteVendorUseCase,
} from 'src/core/use-cases/vendor';
import { VendorRepository, VENDOR_REPOSITORY } from '../../core/domain/repositories/vendor.repository.interface';
import { VendorRepository as VendorRepositoryClass } from '../../infrastructure/database/typeorm/repositories/vendor.repository';
import { VendorEntity } from '../../infrastructure/database/typeorm/entities/Vendor.entity';


@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  controllers: [VendorController],
  providers: [
    VendorService,
    { provide: VENDOR_REPOSITORY, useClass: VendorRepositoryClass },
    {
      provide: CreateVendorUseCase,
      useFactory: (repo: VendorRepository) => new CreateVendorUseCase(repo),
      inject: [VENDOR_REPOSITORY],
    },
    {
      provide: UpdateVendorUseCase,
      useFactory: (repo: VendorRepository) => new UpdateVendorUseCase(repo),
      inject: [VENDOR_REPOSITORY],
    },
    {
      provide: FindAllVendorUseCase,
      useFactory: (repo: VendorRepository) => new FindAllVendorUseCase(repo),
      inject: [VENDOR_REPOSITORY],
    },
    {
      provide: FindVendorByIdUseCase,
      useFactory: (repo: VendorRepository) => new FindVendorByIdUseCase(repo),
      inject: [VENDOR_REPOSITORY],
    },
    {
      provide: DeleteVendorUseCase,
      useFactory: (repo: VendorRepository) => new DeleteVendorUseCase(repo),
      inject: [VENDOR_REPOSITORY],
    },
  ],
})
export class VendorModule {}