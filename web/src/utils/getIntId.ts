import { useRouter } from "next/router";
import { useEffect } from "react";

export const getIntId = () => {
  const router = useRouter();
  // let intId: number = -1;
  // useEffect(() => {
  //   if (router.isReady) {
  //     intId =
  //       typeof router.query.id === "string" ? parseInt(router.query.id) : -1; // Matches id in [id].tsx
  //   }
  // }, [router.isReady]);

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1; // Matches id in [id].tsx

  console.log("getIntId router query id", router.query);
  return intId;
};
