import { httpClient } from "@/providers/proxyProvider";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";

type RouteString = typeof ROUTE_ENUM[keyof typeof ROUTE_ENUM]

class RedirectorError extends Error {
  constructor(readonly url: RouteString) {
    super()
  }
}

function currentUrlStartsWithGivenRoute(currentUrl: string, needleRoute: RouteString) {
  const { pathname } = new URL(currentUrl)
  return pathname === needleRoute
}

const isRootPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.ROOT)
const isLoginPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.LOGIN)
const isRegisterPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.REGISTER)

function isPageForUnauthenticatedOnly(currentUrl: string) {
  return isLoginPage(currentUrl) || isRegisterPage(currentUrl)
}

export async function baseLoader({ request }: LoaderFunctionArgs) {
  try {
    if (isRootPage(request.url)) {
      throw new RedirectorError(ROUTE_ENUM.HOME)
    }
    
    const repository = new UserRepository(new UserService(httpClient))

    const res = await repository.getMe()
    const isAuthenticated = res.isSuccess
    
    if (isAuthenticated && isPageForUnauthenticatedOnly(request.url)) {
      throw new RedirectorError(ROUTE_ENUM.HOME)
    }
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return err instanceof RedirectorError ? redirect(err.url) : null
  }
}
