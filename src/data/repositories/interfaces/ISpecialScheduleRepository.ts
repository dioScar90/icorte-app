import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateOnly } from "@/utils/types/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleRepository {
  createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod): CreatedResult<SpecialSchedule>;
  getSpecialSchedule(barberShopId: number, date: DateOnly): BaseResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShopId: number, pag?: Pagination): PaginationResult<SpecialSchedule>;
  updateSpecialSchedule(barberShopId: number, date: DateOnly, data: SpecialScheduleZod): BaseResult<void>;
  deleteSpecialSchedule(barberShopId: number, date: DateOnly): BaseResult<void>;
}
