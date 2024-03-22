import { NextRequest, NextResponse } from 'next/server'

export default function handler(request: NextRequest) {
  // リクエストの処理など

  // エラー処理
  if (!request) {
    return NextResponse.json({ error: 'Request object is not defined' }, { status: 500 })
  }

  return NextResponse.json({ name: 'shunya' })
}