import { getAuthSession } from "@/actions/auth";

const handler = async (req: Request) => {
  const session = await getAuthSession();

  session.destroy();

  const callbackUrl = new URL(req.url);

  callbackUrl.pathname = "/signin";

  return Response.redirect(callbackUrl);
};

export { handler as GET, handler as POST };
