import { httpClient } from "@/providers/proxyProvider";
import { AdminRepository } from "../repositories/AdminRepository";
import { AdminService } from "../services/AdminService";

export async function lastUsersLoader() {
  // try {
    const repository = new AdminRepository(new AdminService(httpClient))
    return await repository.getLastUsers()
  // } catch (err) {
  //   return []
  // }
}
