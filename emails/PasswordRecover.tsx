import { Button, Html, Text } from "@react-email/components";

export type TPasswordRecovery = {
  link: string;
};

export default function PasswordRecovery({ link }: TPasswordRecovery) {
  return (
    <Html>
      <Text>To reset your password, press the button below:</Text>
      <Button href={link}>Password reset</Button>
    </Html>
  );
}

export { PasswordRecovery };
