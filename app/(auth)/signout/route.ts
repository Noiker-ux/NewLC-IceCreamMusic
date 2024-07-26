import { signOut } from "@/config/auth";

const handler = async () => {
  return await signOut();
};

export { handler as GET, handler as POST };
