import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  console.log("Middleware - req.auth:", req.auth)
  if (!req.auth) {
   return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: ["/signals/:path*","/indicators/:path*","/"],
}
