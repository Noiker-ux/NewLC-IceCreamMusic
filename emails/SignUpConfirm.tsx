import { Button, Html, Text } from "@react-email/components";

export default function EmailPreview() {
  return (
    <Html>
      <Text>
        To confirm your account and finish registration, press the button below:
      </Text>
      <Button href="#">Confirm registration</Button>
    </Html>
  );
}
