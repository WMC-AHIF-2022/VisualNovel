export async function fetchRestEndpoint(
  route: string,
  httpMethod: "GET" | "POST" | "DELETE" | "PUT",
  data?: object
): Promise<any> {
  console.log("reached fetchRestEndpoint")
  let options: any = { method: httpMethod };

  if (data) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(data);
  }
  console.log("sending request");
console.log(route)
  const response = await fetch(route, options);

  if (response.ok) {
    return response;
  } else {
    console.log("recieved error");
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
