import { httpClient } from "@/providers/proxyProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { ProfileRepository } from "../repositories/ProfileRepository";
import { ProfileService } from "../services/ProfileService";

export async function profileLoader({ params }: LoaderFunctionArgs) {
  if (!params.userId) {
    return null
  }

  const userId = +params.userId
  
  try {
    const repository = new ProfileRepository(new ProfileService(httpClient))
    const res = await repository.getProfileById(userId)
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return null
  }
}
