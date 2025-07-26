import { Head, Html, Img, Section, Text } from "@react-email/components";

export default function VerificationSuccess() {
  return (
    <Html>
      <Head>
        <title>Подтверждение верификации</title>
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
          style={{ margin: "20px auto 0 auto" }}
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
          Вы успешно прошли верификацию на площадке ICECREAMMUSIC. Это событие
          открывает перед вами новые горизонты в мире музыки, позволяя вам
          погрузиться в атмосферу творчества и сотрудничества с талантливыми
          артистами. Теперь у вас есть доступ к отгрузке релизов на всевозможные
          существующие площадки.
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
          Ваш путь в индустрии музыки только начинается. Будьте открыты к новым
          знакомствам и экспериментам, рисуйте звучанием мир вокруг себя.
          Исследуйте звучание, соединяйте жанры и создавайте уникальные
          произведения, которые оставят след в сердцах слушателей. Настало время
          сделать шаг вперед и показать миру свой талант!
        </Text>
      </Section>
    </Html>
  );
}
