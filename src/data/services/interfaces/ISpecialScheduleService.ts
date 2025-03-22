import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateString } from "@/utils/types/date-string";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleService {
  createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod): CreatedResult<SpecialSchedule>;
  getSpecialSchedule(barberShopId: number, date: DateString): BaseResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShopId: number, pag?: Pagination): PaginationResult<SpecialSchedule>;
  updateSpecialSchedule(barberShopId: number, date: DateString, data: SpecialScheduleZod): BaseResult<void>;
  deleteSpecialSchedule(barberShopId: number, date: DateString): BaseResult<void>;
}
