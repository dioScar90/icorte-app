import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateOnly } from "@/utils/types/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleService {
  createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod): CreatedAxiosResult<SpecialSchedule>;
  getSpecialSchedule(barberShopId: number, date: DateOnly): BaseAxiosResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShopId: number): PaginationAxiosResult<SpecialSchedule>;
  updateSpecialSchedule(barberShopId: number, date: DateOnly, data: SpecialScheduleZod): BaseAxiosResult<void>;
  deleteSpecialSchedule(barberShopId: number, date: DateOnly): BaseAxiosResult<void>;
}
