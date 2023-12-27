import instance from "@/api/axios";
import { ENDPOINTS } from "@/api/config";

export const postLogin = async () => {
  try {
    const res = await instance.post(ENDPOINTS.AUTH.POST, {
      email: "jieun@codeit.com",
      password: "123asdf",
    });

    if (res.status === 200) return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
  }
};

export const putPassword = async ({
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInRlYW1JZCI6IjEtMDgiLCJpYXQiOjE3MDM1NjYyOTgsImlzcyI6InNwLXRhc2tpZnkifQ.zNaGd4uESNMzrDDHokuybQNJs_CkFLY7SpYKgafPBl0",
}: {
  token: string;
}) => {
  try {
    const res = await instance.put(
      ENDPOINTS.AUTH.PUT,
      {
        password: "asdf1234",
        newPassword: "1234asdf",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 200) return res.data;
  } catch (error: any) {
    console.error(error.response.data.message);
  }
};