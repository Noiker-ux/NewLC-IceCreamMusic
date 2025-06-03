import { makePayout } from "@/actions/payments";
import ModalPopup from "@/widgets/ModalPopup/ModalPopup";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function YouKassaWallet({
  showYouKassa,
  setShowYouKassa,
}: {
  showYouKassa: boolean;
  setShowYouKassa: (stat: boolean) => void;
}) {
  useEffect(() => {
    // @ts-ignore
    const pay = new window.PayoutsData({
      type: "payout",
      account_id: "407649", //Идентификатор шлюза (agentId в личном кабинете)
      success_callback: async function (data: any) {
        console.log("data", JSON.stringify(data));
        await makePayout(data.payout_token).then((payoutData) => {
          enqueueSnackbar({
            message: payoutData.message,
            variant: payoutData.success ? "success" : "error",
          });
        });
        setShowYouKassa(false);
      },
      error_callback: function (error: any) {
        enqueueSnackbar({
          variant: "error",
          message: "Не удается определить платежные данные",
        });
        setShowYouKassa(false);
      },
    });
    pay.render("payout-form").then(() => {});
    return () => {
      pay.clearListeners();
    };
  }, []);

  return (
    <ModalPopup
      title="Кошелек"
      active={showYouKassa}
      setActive={setShowYouKassa}
      width={0}
      height={450}
      view="white"
    >
      <div id="payout-form"></div>
    </ModalPopup>
  );
}
