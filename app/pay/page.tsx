'use client'

import React from 'react'
import styles from './Pay.module.css'

export default function Pay() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <span className={styles.headingAccent}>支払い方法</span>
      </h1>
      <p className={styles.description}>
        ご利用いただきありがとうございます。以下の方法で料金のお支払いが可能です。
      </p>

      <div className={styles.paymentOptions}>
        <div className={styles.paymentOption}>
          <div className={styles.optionIcon}>
            <i className={`${styles.icon} fas fa-credit-card`} />
          </div>
          <h3 className={styles.optionTitle}>クレジットカード</h3>
          <p className={styles.optionDescription}>
            VISA、Mastercard、American Express、JCBなどの主要クレジットカードがご利用いただけます。
          </p>
        </div>

        <div className={styles.paymentOption}>
          <div className={styles.optionIcon}>
            <i className={`${styles.icon} fas fa-mobile-alt`} />
          </div>
          <h3 className={styles.optionTitle}>キャリア決済</h3>
          <p className={styles.optionDescription}>
            docomo、au、SoftBankの携帯料金と合算してお支払いいただけます。
          </p>
        </div>

        <div className={styles.paymentOption}>
          <div className={styles.optionIcon}>
            <i className={`${styles.icon} fas fa-qrcode`} />
          </div>
          <h3 className={styles.optionTitle}>QRコード決済</h3>
          <p className={styles.optionDescription}>
            PayPay、LINE Pay、楽天ペイなどのQRコード決済がご利用いただけます。
          </p>
        </div>
      </div>

      <div className={styles.securePayment}>
        <i className={`${styles.lockIcon} fas fa-lock`} />
        <span className={styles.secureText}>
          お支払いは安全なSSL通信で行われます
        </span>
      </div>
    </div>
  )
}