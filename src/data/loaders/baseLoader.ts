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

const BASE_URL = import.meta.env.VITE_BASE_URL

function currentUrlStartsWithGivenRoute(currentUrl: string, needleRoute: RouteString) {
  const toCompare = BASE_URL + needleRoute

  console.log('loader', { currentUrl, toCompare })

  return currentUrl.startsWith(toCompare)
}

const isRootPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.ROOT)
// const isHomePage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.HOME)
const isLoginPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.LOGIN)
const isRegisterPage = (currentUrl: string) => currentUrlStartsWithGivenRoute(currentUrl, ROUTE_ENUM.REGISTER)

function isPageForUnauthenticatedOnly(currentUrl: string) {
  return isLoginPage(currentUrl)
    || isRegisterPage(currentUrl)
}

// function isAllowedUnauthenticatedPage(currentUrl: string) {
//   return isHomePage(currentUrl)
//     || isLoginPage(currentUrl)
//     || isRegisterPage(currentUrl)
// }

export async function baseLoader({ request }: LoaderFunctionArgs) {
  console.log('rerendered with url =>', request.url)
  console.log('request prop =>', { request })

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
    
    // if (!isAuthenticated && !isAllowedUnauthenticatedPage(request.url)) {
    //   throw new RedirectorError(ROUTE_ENUM.LOGIN)
    // }
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return err instanceof RedirectorError ? redirect(err.url) : null
  }
}
