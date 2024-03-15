import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { routes } from "@/app/lib/routes";

interface Payload {
  email: string;
  role: string;
  id: string;
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
  return payload;
}

async function checkToken(token: string | undefined, request: NextRequest) {
  const currentRoute = findRouteByPathname(request.nextUrl.pathname);
  let response = NextResponse.next();
  if (!token) {
    //On redirige si la route est protégée
    if (currentRoute && currentRoute.protected !== "PUBLIC") {
      response = NextResponse.redirect(new URL("/auth/login", request.url));
    }
    //On delete les cookies existants
    response.cookies.delete("email");
    response.cookies.delete("role");
    response.cookies.delete("id");

    return response;
  }
  try {
    const { email, role, id } = await verify(token);

    if (id && email && role) {
      //On vérifie que le role de l'utilisateur est "ADMIN" pour les routes "ADMIN"
      if (currentRoute?.protected === "ADMIN" && role !== "ADMIN") {
        response = NextResponse.redirect(new URL("/error", request.url)); // Créer une page "Access denied"
      }
      //On ajoute des cookie avec les infos du user
      response.cookies.set("email", email);
      response.cookies.set("role", role);
      response.cookies.set("id", id);

      return response;
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (err) {
    console.error("Verification echouée", err);

    response = NextResponse.redirect(new URL("/auth/login", request.url));
    //On delete les cookies existants
    response.cookies.delete("token");
    response.cookies.delete("email");
    response.cookies.delete("role");
    response.cookies.delete("firstname");

    return response;
  }
}

function findRouteByPathname(url: string) {
  if (url === "/") {
    return routes.home;
  }
  const routeKeys = Object.keys(routes).filter((e) => e !== "home");
  for (const key of routeKeys) {
    if (url.includes(routes[key].pathname)) {
      return routes[key];
    }
  }
  return null;
}
