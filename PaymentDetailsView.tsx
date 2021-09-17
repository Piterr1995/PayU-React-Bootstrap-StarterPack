import React, { useEffect, useState } from "react";

import classnames from "classnames";
import Image from "react-bootstrap/Image";
import { useTranslation } from "react-i18next";

import PayUImage from "assets/payments/payu.png";
import styles from "./PaymentDetailsView.module.scss";

const PaymentDetailsView = () => {
  const { t, i18n } = useTranslation();
  const [sdkForms, setSdkForms] = useState<any>();

  useEffect(() => {
    const payuSdkScript = document.createElement("script");
    const payuMerchScript = document.createElement("script");
    payuSdkScript.src = "https://secure.payu.com/javascript/sdk";
    payuSdkScript.type = "text/javascript";
    payuMerchScript.src = "https://secure.snd.payu.com/javascript/sdk";
    payuMerchScript.type = "text/javascript";
    document.body.appendChild(payuSdkScript);
    document.body.appendChild(payuMerchScript);

    payuMerchScript.onload = () => {
      const optionsForms: any = {
        cardIcon: true,
        style: {
          basic: {
            fontSize: "24px",
          },
        },
        placeholder: {
          number: "",
          date: "MM/YY",
          cvv: "",
        },
        lang: i18n.language,
      };

      const payuSdkForms: any = PayU("393823");
      setSdkForms(payuSdkForms);
      const secureForms = payuSdkForms.secureForms();

      const cardNumber = secureForms.add("number", optionsForms);
      const cardDate = secureForms.add("date", optionsForms);
      const cardCvv = secureForms.add("cvv", optionsForms);

      cardNumber.render("#payu-card-number");
      cardDate.render("#payu-card-date");
      cardCvv.render("#payu-card-cvv");
    };
    return () => {
      document.body.removeChild(payuSdkScript);
      document.body.removeChild(payuMerchScript);
    };
  }, [i18n.language]);

  const tokenizeCardInfo = () => {
    // handle tokenization
  };

  return (
    <>
      <h1 className="text-center mt-5">{t("payments_add_payment_title")}</h1>
      <section className={styles.container}>
        <div className={styles.cardContainer}>
          <aside>Numer Karty</aside>
          <div className={styles.payuCardForm} id="payu-card-number"></div>

          <div className={classnames(styles.cardDetails, "clearfix")}>
            <div className="expiration">
              <aside>Ważna do</aside>
              <div className={styles.payuCardForm} id="payu-card-date"></div>
            </div>

            <div className="cvv">
              <aside>CVV</aside>
              <div className={styles.payuCardForm} id="payu-card-cvv"></div>
            </div>
          </div>
        </div>

        <div className={classnames("text-left mt-3", styles.policies)}>
          {i18n.language === "pl" && (
            <p>{t("payments_payment_request_info")}</p>
          )}

          <p>
            {t("payments_policies_confirmation_info_first_part")}{" "}
            <a href={t("payments_policies_confirmation_info_link_to_policies")}>
              {t("payments_policies_confirmation_info_link_to_policies_text")}
            </a>
          </p>
          <p>{t("payments_personal_data_protection_info")}</p>
          <p>{t("payments_personal_data_potential_recipients_visible_part")}</p>
        </div>
        <button
          id="tokenizeButton"
          onClick={tokenizeCardInfo}
          className={styles.button}
        >
          Zapłać
        </button>

        <div id="responseTokenize"></div>
        <Image
          src={PayUImage}
          alt="PayU payment image"
          className="m-auto"
          fluid
        />
      </section>
    </>
  );
};

export default PaymentDetailsView;
