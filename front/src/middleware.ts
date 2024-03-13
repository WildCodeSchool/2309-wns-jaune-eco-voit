import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface Payload {
  email: string;
  role: string;
  firstname: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "";

export default async function middleware(request: NextRequest) {
  //On récupère le cookie dans la requete
  const { cookies } = request;
  //On vérifie la présence d'un token
  const token = cookies.get("token");

  return await checkToken(token?.value, request);
}

//Fonction de vérification du token
export async function verify(token: string): Promise<Payload> {
  const { payload } = await jwtVerify<Payload>(
    token,
    new TextEncoder().encode(SECRET_KEY)
  );
  console.log(payload);

  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  if (!token) {
    const response = NextResponse.next();
    //On delete les cookies existants
    response.cookies.delete("email");
    response.cookies.delete("role");
    response.cookies.delete("firstname");

    //On redirige vers la page de connexion
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const { email, role, firstname } = await verify(token);

    if (email && role) {
      const response = NextResponse.next();
      response.cookies.set("email", email);
      response.cookies.set("role", role);
      response.cookies.set("firstname", firstname);
      if (role === "USER" && request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/error", request.url));
      }
      return response;
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (err) {
    console.error("Verification failed", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: "/auth/register/:path*",
};
