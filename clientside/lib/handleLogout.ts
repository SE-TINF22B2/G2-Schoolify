export function handleLogout(Cookies: any){
    Cookies.remove("role");
    Cookies.remove("session");
    Cookies.remove("classID");
}