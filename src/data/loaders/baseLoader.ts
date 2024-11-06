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

function getBaseUrlFromFullUrl(fullUrl: string) {
  const originRegex = /^(https?:\/\/[^\/]+)/
  return fullUrl.match(originRegex)?.at(0)
}

function currentUrlStartsWithGivenRoute(currentUrl: string, needleRoute: RouteString) {
  const baseUrl = getBaseUrlFromFullUrl(currentUrl)

  if (!baseUrl) {
    return false
  }

  const toCompare = baseUrl + needleRoute
  console.log({currentUrl, toCompare})
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

export async function baseLoader({ request, params }: LoaderFunctionArgs) {
  // console.log('rerendered with url =>', request.url)
  console.log('request =>', request)
  console.log('params =>', params)

  try {
    if (isRootPage(request.url)) {
      throw new RedirectorError(ROUTE_ENUM.HOME)
    }
    
    const repository = new UserRepository(new UserService(httpClient))

    const res = await repository.getMe()
    const isAuthenticated = res.isSuccess

    console.log({
      isAuthenticated,
      issss: isPageForUnauthenticatedOnly(request.url)
    })
    
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
