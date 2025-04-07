// 이미지 최적화 관련 유틸리티 함수
import imageCompression from 'browser-image-compression'

// 이미지 최적화 옵션
const defaultOptions = {
  maxSizeMB: 1, // 최대 파일 크기 (1MB)
  maxWidthOrHeight: 1920, // 최대 너비 또는 높이 (1920px)
  useWebWorker: true, // WebWorker 사용 (백그라운드 처리)
  fileType: 'image/jpeg', // 출력 파일 형식
  initialQuality: 0.8, // 초기 품질 (0.8 = 80%)
}

/**
 * 이미지 파일 압축 함수
 * @param file 원본 이미지 파일
 * @param options 압축 옵션 (옵션)
 * @returns 압축된 이미지 파일
 */
export const compressImage = async (
  file: File,
  options?: Partial<typeof defaultOptions>,
): Promise<File> => {
  try {
    console.log(`압축 전 이미지 크기: ${file.size / 1024 / 1024} MB`)

    // 옵션 합치기
    const compressionOptions = {
      ...defaultOptions,
      ...options,
    }

    // 이미지 압축 (browser-image-compression 라이브러리 사용)
    const compressedFile = await imageCompression(file, compressionOptions)

    console.log(`압축 후 이미지 크기: ${compressedFile.size / 1024 / 1024} MB`)

    return compressedFile
  } catch (error) {
    console.error('이미지 압축 중 오류 발생:', error)
    // 압축 실패 시 원본 파일 반환
    return file
  }
}

/**
 * 이미지 Base64 변환 함수
 * @param file 이미지 파일
 * @returns Base64 인코딩된 문자열
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 여러 이미지 파일 압축 함수
 * @param files 원본 이미지 파일 배열
 * @param options 압축 옵션 (옵션)
 * @returns 압축된 이미지 파일 배열
 */
export const compressImageFiles = async (
  files: File[],
  options?: Partial<typeof defaultOptions>,
): Promise<File[]> => {
  try {
    const compressPromises = files.map((file) => compressImage(file, options))
    return await Promise.all(compressPromises)
  } catch (error) {
    console.error('이미지 일괄 압축 중 오류 발생:', error)
    return files // 압축 실패 시 원본 파일 배열 반환
  }
}
