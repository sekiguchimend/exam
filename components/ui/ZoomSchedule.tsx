// ZoomSchedule コンポーネントを別のファイルに移動する
// ZoomSchedule.tsx

import React from 'react';

const ZoomSchedule = () => {
  const schedules = [
    {
      title: '数学の勉強会',
      date: '2023年5月20日 19:00 - 21:00',
      link: 'https://zoom.us/j/1234567890',
    },
    {
      title: '英語の発音練習',
      date: '2023年5月25日 18:00 - 19:30',
      link: 'https://zoom.us/j/0987654321',
    },
    // 他のスケジュールを追加
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg w-64">
      <h2 className="text-xl font-semibold mb-4 text-indigo-900">Zoomスケジュール</h2>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={index} className="mb-4">
            <h3 className="text-lg font-medium text-indigo-800">{schedule.title}</h3>
            <p className="text-sm text-gray-600">{schedule.date}</p>
            <a
              href={schedule.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {/*
               * FaLinkコンポーネントを追加
               * Zoomリンク
               */}
              Zoomリンク
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZoomSchedule;
