import { create } from "ipfs-http-client";
// import { v4 as uuidv4 } from "uuid";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export const uploadImageIpfs = async (payload: any) => {
  console.log("ipfs upload payload", payload);

  const file_send = {
    path: payload.path,
    content: payload.content,
  };

  console.log("file_send", file_send);
  //   const result = await client.add(file_send, function (err, json) {
  //     if (err) {
  //       alert(err);
  //       return err;
  //     } else {
  //       return json;
  //     }
  //   });
  //   return result;
};
