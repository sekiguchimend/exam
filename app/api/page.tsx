import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const GET = (request: NextRequest) => {
  // リクエストの処理など

  // エラー処理
  if (!request) {
    return NextResponse.json({ error: 'Request object is not defined' }, { status: 500 })
  }

  return NextResponse.json({ name: 'shunya' })
}