import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
export default function Home() {
 
  return (
    <>
    <main className="p-24 flex justify-center items-center">
      <div style={{ width: "800px" }}> 
      <Accordion type="single" collapsible style={{ width: "100%" }}>
  <AccordionItem value="item-1">
    <AccordionTrigger>偏差値どれくらいの人が多いの？</AccordionTrigger>
    <AccordionContent>
     偏差値65以下の高校の人しかこのコミュニティーには入れません。よって
     今はあまり学力はないが絶対逆転合格するぞという強い気持ちの人が多いです。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>コミュニティー入ったらやらなければいけないこととかある？</AccordionTrigger>
    <AccordionContent>
      基本的に自主参加性ですのでやりたい人がやる感じです。オフ会などもありますが強制ではありません。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>コミュニティーって何するの？</AccordionTrigger>
    <AccordionContent>
      その大学を志望する人達に自分の悩みを相談できたり月の初めに目標を公言してその目標が達成したかどうかを
      他の人に報告したり模試を見せ合ったりオフ会したりなど様々。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-4">
    <AccordionTrigger>どうにコミュニティーに入れるの？</AccordionTrigger>
    <AccordionContent>
    お問い合わせフォームで当サイトを使用するアカウントのメールアドレスを入力して自分の高校と名前を入力し
    送信します。こちらが送られてきたメールアドレスに指定の口座を送るので月謝が振り込まれたら入ることができます。
    親御さんにやって貰えればすぐにできると思います。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-5">
    <AccordionTrigger>どこで活動するの？</AccordionTrigger>
    <AccordionContent>
     当サイトのヘッダーのUniversityのとこにいき自分が志望する大学をタップしてそこで
      同じ志望校の人とチャットしあったりしています。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-6">
    <AccordionTrigger>自分の出身校や名前を知られたくない</AccordionTrigger>
    <AccordionContent>
    コミュニティー内では匿名です。もちろん公言している人もいます
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-7">
    <AccordionTrigger>料金体系は？</AccordionTrigger>
    <AccordionContent>
    料金は月に3000円です。それ以上請求することはありません。前払いなので10日前から月謝の通知が毎日行くようになります。
    未払いの状態で次の月に行った場合10日間以内に払ってもらえれば問題ありませんが10日間超えても払われない場合コミュニティー
    からブロックされ使えなくなります。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-8">
    <AccordionTrigger>入るメリットは？</AccordionTrigger>
    <AccordionContent>
      モチベーションが維持できたり入学後の友達の心配をしなくて済みます。
    </AccordionContent>
  </AccordionItem>
</Accordion>

     </div>
    </main>
    </>
  );
}
