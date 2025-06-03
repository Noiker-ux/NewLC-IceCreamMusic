import {
  Button,
  Head,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";

export type TSignUpConfirm = {
  link: string;
};

export default function SignUpConfirm({ link }: TSignUpConfirm) {
  return (
    <Html>
      <Head>
        <title>Подтверждение регистрации</title>
      </Head>
      <Section
        style={{
          backgroundColor: "#121316",
          borderRadius: "5px",
          padding: "20px",
          width: "500px",
        }}
      >
        <Img
          src="https://www.icecreammusic.net/assets/logo.png"
          width="120"
          height="120"
          style={{ margin: " 20px auto 0 auto" }}
        />
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "fantasy",
            letterSpacing: "5px",
            textAlign: "center",
          }}
        >
          ICECREAMMUSIC
        </Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "monospace",
            letterSpacing: "1px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          Чтобы подтвердить свою учетную запись и завершить регистрацию, нажмите
          на кнопку ниже:
        </Text>
        <Button
          style={{
            color: "#FFFFFF",
            fontFamily: "monospace",
            letterSpacing: "1px",
            padding: "5px 10px",
            borderRadius: "3px",
            display: "flex",
            width: "fit-content",
            margin: "30px auto 30px auto",
            backgroundColor: "#5451ff",
            border: "1px solid #5451ff",
            cursor: "pointer",
          }}
          href={link}
        >
          Подтвердить регистрацию
        </Button>
      </Section>
    </Html>
  );
}

export { SignUpConfirm };
