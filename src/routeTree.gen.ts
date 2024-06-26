/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignInRouteImport } from './routes/sign-in/route'
import { Route as AuthRouteImport } from './routes/_auth/route'
import { Route as RouteImport } from './routes/route'
import { Route as AuthDashboardRouteImport } from './routes/_auth/dashboard/route'
import { Route as AuthProductsIndexImport } from './routes/_auth/products/index'
import { Route as AuthProductsCreateImport } from './routes/_auth/products/create'
import { Route as AuthProductsProductIdImport } from './routes/_auth/products/$productId'

// Create/Update Routes

const SignInRouteRoute = SignInRouteImport.update({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const RouteRoute = RouteImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthDashboardRouteRoute = AuthDashboardRouteImport.update({
  path: '/dashboard',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthProductsIndexRoute = AuthProductsIndexImport.update({
  path: '/products/',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthProductsCreateRoute = AuthProductsCreateImport.update({
  path: '/products/create',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthProductsProductIdRoute = AuthProductsProductIdImport.update({
  path: '/products/$productId',
  getParentRoute: () => AuthRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof RouteImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInRouteImport
      parentRoute: typeof rootRoute
    }
    '/_auth/dashboard': {
      id: '/_auth/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthDashboardRouteImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/products/$productId': {
      id: '/_auth/products/$productId'
      path: '/products/$productId'
      fullPath: '/products/$productId'
      preLoaderRoute: typeof AuthProductsProductIdImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/products/create': {
      id: '/_auth/products/create'
      path: '/products/create'
      fullPath: '/products/create'
      preLoaderRoute: typeof AuthProductsCreateImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/products/': {
      id: '/_auth/products/'
      path: '/products'
      fullPath: '/products'
      preLoaderRoute: typeof AuthProductsIndexImport
      parentRoute: typeof AuthRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  RouteRoute,
  AuthRouteRoute: AuthRouteRoute.addChildren({
    AuthDashboardRouteRoute,
    AuthProductsProductIdRoute,
    AuthProductsCreateRoute,
    AuthProductsIndexRoute,
  }),
  SignInRouteRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth",
        "/sign-in"
      ]
    },
    "/": {
      "filePath": "route.tsx"
    },
    "/_auth": {
      "filePath": "_auth/route.tsx",
      "children": [
        "/_auth/dashboard",
        "/_auth/products/$productId",
        "/_auth/products/create",
        "/_auth/products/"
      ]
    },
    "/sign-in": {
      "filePath": "sign-in/route.tsx"
    },
    "/_auth/dashboard": {
      "filePath": "_auth/dashboard/route.tsx",
      "parent": "/_auth"
    },
    "/_auth/products/$productId": {
      "filePath": "_auth/products/$productId.tsx",
      "parent": "/_auth"
    },
    "/_auth/products/create": {
      "filePath": "_auth/products/create.tsx",
      "parent": "/_auth"
    },
    "/_auth/products/": {
      "filePath": "_auth/products/index.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
