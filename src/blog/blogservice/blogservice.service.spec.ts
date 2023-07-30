import { Test, TestingModule } from '@nestjs/testing';
import { BlogserviceService } from './blogservice.service';

describe('BlogserviceService', () => {
  let service: BlogserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogserviceService],
    }).compile();

    service = module.get<BlogserviceService>(BlogserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
