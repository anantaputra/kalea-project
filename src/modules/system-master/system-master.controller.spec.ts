import { Test, TestingModule } from '@nestjs/testing';
import { SystemMasterController } from './system-master.controller';
import { SystemMasterService } from './system-master.service';
import { CreateSystemMasterDto } from './dto/create-system-master.dto';
import { UpdateSystemMasterDto } from './dto/update-system-master.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SystemMaster } from '../../core/domain/entities/system-master.entity';

describe('SystemMasterController', () => {
  let controller: SystemMasterController;
  let service: jest.Mocked<SystemMasterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemMasterController],
      providers: [
        {
          provide: SystemMasterService,
          useValue: {
            findBySystemType: jest.fn(),
            findBySystemTypeSystemCd: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SystemMasterController>(SystemMasterController);
    service = module.get(SystemMasterService);
  });

  describe('findBySystemType', () => {
    it('returns list with standard response shape and forwards Accept-Language', async () => {
      const entities: SystemMaster[] = [
        new SystemMaster(
          'ROLE',
          'admin',
          'Administrator',
          '1',
          new Date('2024-10-01T10:00:00.000Z'),
          undefined,
          undefined,
        ),
      ];
      service.findBySystemType.mockResolvedValue(entities);

      const res = await controller.findBySystemType('ROLE', {
        'accept-language': 'en-US',
      } as any);
      expect(service.findBySystemType).toHaveBeenCalledWith('ROLE', 'en-US');
      expect(res).toEqual(
        expect.objectContaining({
          success: true,
          data: entities,
          message: null,
        }),
      );
    });

    it('propagates BadRequestException from service', async () => {
      service.findBySystemType.mockRejectedValue(
        new BadRequestException('system_type wajib diisi'),
      );
      await expect(
        controller.findBySystemType('', { 'accept-language': 'id-ID' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('returns entity with localized success message and forwards Accept-Language', async () => {
      const entity = new SystemMaster(
        'ROLE',
        'admin',
        'Administrator',
        '1',
        new Date('2024-10-01T10:00:00.000Z'),
        '2',
        new Date('2024-10-10T12:00:00.000Z'),
      );
      service.findBySystemTypeSystemCd.mockResolvedValue(entity);

      const res = await controller.findOne('ROLE', 'admin', {
        'accept-language': 'en-US',
      } as any);
      expect(service.findBySystemTypeSystemCd).toHaveBeenCalledWith(
        'ROLE',
        'admin',
        'en-US',
      );
      expect(res).toEqual(
        expect.objectContaining({
          success: true,
          data: entity,
          message: 'System Master retrieved successfully',
        }),
      );
    });

    it('propagates NotFoundException from service', async () => {
      service.findBySystemTypeSystemCd.mockRejectedValue(
        new NotFoundException('System Master not found'),
      );
      await expect(
        controller.findOne('ROLE', 'missing', {
          'accept-language': 'en-US',
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('returns created entity and forwards Accept-Language', async () => {
      const dto: CreateSystemMasterDto = {
        system_type: 'ROLE',
        system_cd: 'admin',
        system_value: 'Administrator',
        user_id: '1',
      };
      const entity = new SystemMaster(
        'ROLE',
        'admin',
        'Administrator',
        '1',
        new Date('2024-10-01T10:00:00.000Z'),
        undefined,
        undefined,
      );
      service.create.mockResolvedValue(entity);

      const res = await controller.create(dto, {
        'accept-language': 'en-US',
      } as any);
      expect(service.create).toHaveBeenCalledWith(dto, 'en-US');
      expect(res).toEqual(
        expect.objectContaining({
          success: true,
          data: entity,
          message: 'System Master created successfully',
        }),
      );
    });

    it('propagates BadRequestException and ConflictException', async () => {
      const dto: CreateSystemMasterDto = {
        system_type: '',
        system_cd: 'admin',
        system_value: 'Administrator',
        user_id: '1',
      };
      service.create.mockRejectedValueOnce(
        new BadRequestException('system_type wajib diisi'),
      );
      await expect(
        controller.create(dto, { 'accept-language': 'id-ID' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);

      const dto2: CreateSystemMasterDto = {
        system_type: 'ROLE',
        system_cd: 'admin',
        system_value: 'Administrator',
        user_id: '1',
      };
      service.create.mockRejectedValueOnce(
        new ConflictException('System Master already exists'),
      );
      await expect(
        controller.create(dto2, { 'accept-language': 'en-US' } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('update', () => {
    it('returns updated entity and forwards Accept-Language', async () => {
      const dto: UpdateSystemMasterDto = {
        system_value: 'Admin',
        user_id: '2',
      };
      const entity = new SystemMaster(
        'ROLE',
        'admin',
        'Admin',
        '1',
        new Date('2024-10-01T10:00:00.000Z'),
        '2',
        new Date('2024-10-10T12:00:00.000Z'),
      );
      service.update.mockResolvedValue(entity);

      const res = await controller.update('ROLE', 'admin', dto, {
        'accept-language': 'en-US',
      } as any);
      expect(service.update).toHaveBeenCalledWith(
        'ROLE',
        'admin',
        dto,
        'en-US',
      );
      expect(res).toEqual(
        expect.objectContaining({
          success: true,
          data: entity,
          message: 'System Master updated successfully',
        }),
      );
    });

    it('propagates BadRequestException and NotFoundException', async () => {
      const dto: UpdateSystemMasterDto = { system_value: '', user_id: '2' };
      service.update.mockRejectedValueOnce(
        new BadRequestException('system_value wajib diisi'),
      );
      await expect(
        controller.update('ROLE', 'admin', dto, {
          'accept-language': 'id-ID',
        } as any),
      ).rejects.toBeInstanceOf(BadRequestException);

      const dto2: UpdateSystemMasterDto = {
        system_value: 'Admin',
        user_id: '2',
      };
      service.update.mockRejectedValueOnce(
        new NotFoundException('System Master not found'),
      );
      await expect(
        controller.update('ROLE', 'missing', dto2, {
          'accept-language': 'en-US',
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('returns deleted response and forwards Accept-Language', async () => {
      service.remove.mockResolvedValue(undefined);

      const res = await controller.remove('ROLE', 'admin', {
        'accept-language': 'en-US',
      } as any);
      expect(service.remove).toHaveBeenCalledWith('ROLE', 'admin', 'en-US');
      expect(res).toEqual(
        expect.objectContaining({
          success: true,
          data: { deleted: true },
          message: 'System Master deleted successfully',
        }),
      );
    });

    it('propagates NotFoundException and BadRequestException', async () => {
      service.remove.mockRejectedValueOnce(
        new NotFoundException('System Master not found'),
      );
      await expect(
        controller.remove('ROLE', 'missing', {
          'accept-language': 'en-US',
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);

      service.remove.mockRejectedValueOnce(
        new BadRequestException('system_type wajib diisi'),
      );
      await expect(
        controller.remove('', 'admin', { 'accept-language': 'id-ID' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
