// 東京大学のページを作成します。
import React from 'react';
import Link from 'next/link';
import {Header} from "../../components/Header";
export default function TodaiPage (){
  return (
    <>
    <Header />
    <div>
      <h1>東京大学</h1>
      <p>東京大学を志望する方のコミュニティー。赤門目指して頑張ろう！</p>
      <Link href="/University/toudai/discussion">
        <a>ディスカッションに参加する</a>
      </Link>
    </div>
    </>
  );
};

