import crypto from "crypto";

export const md5 = (data: string) => {
  const hash = crypto.createHash("md5");
  hash.update(data);

  return hash.digest("hex");
};
