import { label } from "next-api-middleware";
import verifyHmac from "./verifyHmac.js";
import verifyProxy from "./verifyProxy.js";
import verifyRequest from "./verifyRequest.js";

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
});

export default withMiddleware;
