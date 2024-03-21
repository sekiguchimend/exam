'use client'

import React from 'react'
import styles from './Pwa.module.css'

export default function Pwa() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <span className={styles.headingAccent}>ウェブサイトを</span>
        <br />
        インストールしよう!
      </h1>
      <p className={styles.description}>
        このウェブサイトをプログレッシブウェブアプリ (PWA) としてデバイスにインストールすると、
        ネイティブアプリのような高速で信頼できる体験が得られます。
      </p>

      <div className={styles.benefitsContainer}>
        <h2 className={styles.subheading}>抜群の利点</h2>
        <ul className={styles.benefits}>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>⚡</span>
            <span className={styles.benefitText}>blazing-fast & スムーズな体験</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>📦</span>
            <span className={styles.benefitText}>一部機能はオフラインでも利用可能</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>🔒</span>
            <span className={styles.benefitText}>より安全で信頼できる体験</span>
          </li>
        </ul>
      </div>

      <div className={styles.instructionsContainer}>
        <h2 className={styles.subheading}>簡単3ステップ</h2>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepIcon}>1</span>
            <span className={styles.stepText}>モバイルブラウザのアドレスバーにある <span className={styles.icon}>☰</span> または <span className={styles.icon}>⋯</span> アイコンをタップ</span>
          </li>
          <li>
            <span className={styles.stepIcon}>2</span>
            <span className={styles.stepText}>メニューから「ホーム画面に追加」または「インストール」を選択</span>
          </li>
          <li>
            <span className={styles.stepIcon}>3</span>
            <span className={styles.stepText}>確認画面で「インストール」または「追加」をタップ</span>
          </li>
        </ol>
      </div>

      <p className={styles.callToAction}>
        今すぐインストールして、体験を一味違うものに!
      </p>
    </div>
  )
}