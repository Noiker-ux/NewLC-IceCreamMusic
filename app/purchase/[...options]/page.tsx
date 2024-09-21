"use client";
import { makePayment } from "@/actions/payments";
// import Header from "@/entities/Header/Header";
import { Error } from "@/entities/Error";

export default function PurchasePage({
  params,
}: {
  params: { options: string[] };
}) {
  const [type, level_or_id] = params.options;

  if (type !== "subscription" && type !== "release") {
    return <Error statusCode={404} />;
  }

  // if (type === "subscripttion") {

  // }

  // if (type === "release") {

  // }

  return (
    <div style={{ display: "block" }}>
      <header>header</header>
      <main>
        <button
          onClick={() => {
            makePayment();
          }}
        >
          makePayment
        </button>
      </main>
    </div>
  );
}
