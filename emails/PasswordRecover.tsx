import { Button, Html, Text } from "@react-email/components";

export type TPasswordRecovery = {
  name: string;
  link: string;
};

export default function PasswordRecovery({}: TPasswordRecovery) {
  return (
    <Html>
      <Text>To reset your password, press the button below:</Text>
      <Button href="#">Password reset</Button>
    </Html>
  );
}

export { PasswordRecovery };
