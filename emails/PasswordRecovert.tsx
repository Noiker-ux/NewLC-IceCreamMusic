import { Button, Html, Text } from "@react-email/components";

export default function EmailPreview() {
  return (
    <Html>
      <Text>To reset your password, press the button below:</Text>
      <Button href="#">Password reset</Button>
    </Html>
  );
}
