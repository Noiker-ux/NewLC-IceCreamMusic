import { Head, Html, Img, Section, Text } from "@react-email/components";

export default function ReleaseSuccess({ title }: { title: string }) {
  return (
    <Html>
      <Head>
        <title>Успешная отгрузка релиза</title>
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
          Поздравляем! Релиз &quot;{title}&quot; прошел модерацию и теперь может
          быть доступен всем слушателям. Мы уверены, что каждый найдет в этом
          релизе что-то близкое и знакомое.
        </Text>
      </Section>
    </Html>
  );
}
