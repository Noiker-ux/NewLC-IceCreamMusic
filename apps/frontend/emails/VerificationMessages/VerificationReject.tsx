import { Head, Html, Img, Section, Text } from "@react-email/components";

export default function VerificationReject() {
  return (
    <Html>
      <Head>
        <title>Отказ в верификации</title>
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
            textAlign: "justify",
            padding: "0 20px",
          }}
        >
          К сожалению, верификация на площадке ICECREAMMUSIC не прошла.
          Пользователи, столкнувшиеся с этой проблемой, могут испытывать
          разочарование, особенно если они ожидали быстро начать свой путь в
          мире музыки.
        </Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "monospace",
            letterSpacing: "1px",
            textAlign: "justify",
            padding: "0 20px",
            marginTop: "20px",
          }}
        >
          Тем не менее, стоит рассмотреть возможность повторной попытки
          верификации с вниманием ко всем установленным требованиям. На
          платформе также доступна поддержка, которая может помочь пользователям
          разобраться с возникшими трудностями.
        </Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "monospace",
            letterSpacing: "1px",
            textAlign: "justify",
            padding: "0 20px",
            marginTop: "20px",
          }}
        >
          Поддержка площадки всегда готова оказать помощь, поэтому не стоит
          оставаться наедине с проблемой.
        </Text>
      </Section>
    </Html>
  );
}
