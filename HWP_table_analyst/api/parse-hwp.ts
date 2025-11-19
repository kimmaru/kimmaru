// import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore
import formidable from 'formidable';
import * as hwp from 'hwp.js';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  return res.status(200).json({ message: '서버리스 함수 정상 동작' });
} 