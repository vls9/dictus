export async function checkImageLink(url: string): Promise<boolean> {
  return fetch(url, { method: "HEAD" })
    .then((response) => {
      if (
        response.status === 200 &&
        response.headers.get("content-type")?.startsWith("image")
      ) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}
