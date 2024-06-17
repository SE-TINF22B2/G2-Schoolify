"use client";

export function loginRequest(
  email: string,
  password: string,
  setErrorMessage: any,
  router : any,
) {
  fetch("api/auth/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          email: email,
          password: password,
      }),
  })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
          if (data.access_token) {
              router.push("/");
        
          } else {
              setErrorMessage(data.message);
             
          }

      
      })
      .catch((error) => {
          setErrorMessage(error);
      });

}
