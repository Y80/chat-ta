import { fs } from '@tauri-apps/api'

const DEFAULT_DIR = fs.BaseDirectory.AppData

/**
 * 写文件时，应确保文件夹的存在，文件夹不存在，则无法写入
 * 使用 fs.createDir() 创建文件夹，如果文件夹已经存在，不会重复创建
 */
async function prepareWrite() {
  await fs.createDir('dir', { dir: DEFAULT_DIR, recursive: true })
}

export async function writeTextFile(file: Record<'path' | 'contents', string>) {
  await prepareWrite()
  await fs.writeTextFile(file, { dir: DEFAULT_DIR })
}

export async function readTextFile(filePath: string) {
  return await fs.readTextFile(filePath, { dir: DEFAULT_DIR })
}

export async function exists(path: string) {
  return await fs.exists(path, { dir: DEFAULT_DIR })
}
