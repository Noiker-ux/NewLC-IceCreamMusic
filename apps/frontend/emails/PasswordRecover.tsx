import {
  Button,
  Head,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";

export type TPasswordRecovery = {
  link: string;
};

export default function PasswordRecovery({ link }: TPasswordRecovery) {
  return (
    <Html>
      <Head>
        <title>Восстановление пароля</title>
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
        ;
        <Text
          style={{
            color: "#FFFFFF",
            letterSpacing: "5px",
            fontFamily: "fantasy",
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
          Здравствуйте, Вас приветствует
          <br />
          команда ICECREAMMUSIC <br />
          <br />
          Мы слышали, что вы забыли пароль, не беспокойтесь мы быстро поможем
          вам решить эту проблему.
          <br />
          <br />
          Чтобы сбросить свой пароль, нажмите кнопку ниже:
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
          Сбросить пароль
        </Button>
      </Section>
    </Html>
  );
}

export { PasswordRecovery };
