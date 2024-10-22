import { SpecialScheduleType } from "@/schemas/specialSchedule";
import { DateOnly } from "@/types/models/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";
import { AxiosResponse } from "axios";

export interface ISpecialScheduleService {
  createSpecialSchedule(barberShpoId: number, data: SpecialScheduleType): Promise<AxiosResponse<boolean>>;
  getSpecialSchedule(barberShpoId: number, date: DateOnly): Promise<AxiosResponse<SpecialSchedule>>;
  getAllSpecialSchedules(barberShpoId: number): Promise<AxiosResponse<SpecialSchedule[]>>;
  updateSpecialSchedule(barberShpoId: number, date: DateOnly, data: SpecialScheduleType): Promise<AxiosResponse<boolean>>;
  deleteSpecialSchedule(barberShpoId: number, date: DateOnly): Promise<AxiosResponse<boolean>>;
}
