import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            processPayment: jest.fn().mockResolvedValue({ id: '1' }),
            getPaymentByBooking: jest.fn().mockResolvedValue({ id: '1' }),
            mockSettlePayment: jest.fn().mockResolvedValue({ status: 'SUCCESS', transactionId: 'MOCK-1' }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call mockSettlePayment on mockSettle endpoint', async () => {
    const res = await controller.mockSettle('b-100');
    expect(res.status).toBe('SUCCESS');
  });
});

