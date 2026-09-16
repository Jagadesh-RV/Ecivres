import { PaginationQueryDto } from './pagination-query.dto';

describe('PaginationQueryDto', () => {
  it('should default page to 1 and limit to 20 with correct skip offset', () => {
    const dto = new PaginationQueryDto();
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(20);
    expect(dto.skip).toBe(0);
  });

  it('should compute skip offset correctly for page 3 with limit 15', () => {
    const dto = new PaginationQueryDto();
    dto.page = 3;
    dto.limit = 15;
    expect(dto.skip).toBe(30);
  });
});
