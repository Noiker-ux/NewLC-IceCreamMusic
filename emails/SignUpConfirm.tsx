import { Button, Html, Text } from "@react-email/components";

export type TSignUpConfirm = {
  link: string;
};

export default function SignUpConfirm({ link }: TSignUpConfirm) {
  return (
    <Html>
      <Text>
        To confirm your account and finish registration, press the button below:
      </Text>
      <Button href={link}>Confirm registration</Button>
    </Html>
  );
}

export { SignUpConfirm };
