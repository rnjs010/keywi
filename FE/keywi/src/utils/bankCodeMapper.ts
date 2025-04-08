// utils/bankCodeMapper.ts
interface BankInfo {
  code: string
  name: string
  logoPath: string
}

const BANK_MAP: Record<string, BankInfo> = {
  '001': { code: '001', name: '한국은행', logoPath: '/banks/한국.png' },
  '002': { code: '002', name: '산업은행', logoPath: '/banks/산업.png' },
  '003': { code: '003', name: '기업은행', logoPath: '/banks/기업.png' },
  '004': { code: '004', name: '국민은행', logoPath: '/banks/국민.png' },
  '011': { code: '011', name: '농협은행', logoPath: '/banks/농협.png' },
  '020': { code: '020', name: '우리은행', logoPath: '/banks/우리.png' },
  '023': { code: '023', name: 'SC제일은행', logoPath: '/banks/SC제일.png' },
  '027': { code: '027', name: '시티은행', logoPath: '/banks/시티.png' },
  '032': { code: '032', name: '대구은행', logoPath: '/banks/iM뱅크(대구).png' },
  '034': { code: '034', name: '광주은행', logoPath: '/banks/광주.png' },
  '035': { code: '035', name: '제주은행', logoPath: '/banks/제주.png' },
  '037': { code: '037', name: '전북은행', logoPath: '/banks/전북.png' },
  '039': { code: '039', name: '경남은행', logoPath: '/banks/경남.png' },
  '045': { code: '045', name: '새마을금고', logoPath: '/banks/새마을금고.png' },
  '081': { code: '081', name: 'KEB하나은행', logoPath: '/banks/하나.png' },
  '088': { code: '088', name: '신한은행', logoPath: '/banks/신한.png' },
  '090': { code: '090', name: '카카오뱅크', logoPath: '/banks/카카오뱅크.png' },
  '999': { code: '999', name: '싸피은행', logoPath: '/banks/싸피.png' },
}

// 은행 코드로 은행 정보 가져오기
export const getBankInfo = (bankCode: string): BankInfo => {
  return (
    BANK_MAP[bankCode] || {
      code: bankCode,
      name: '알 수 없는 은행',
      logoPath: '/banks/우리.png', // 기본 로고
    }
  )
}

// 은행 이름 불러오기
export const getBankName = (bankCode: string): string => {
  return getBankInfo(bankCode).name
}

// 은행 로고 경로 불러오기
export const getBankLogoPath = (bankCode: string): string => {
  return getBankInfo(bankCode).logoPath
}

// 계좌번호 포맷팅 (XXXX-XX-XXXX 형식)
export const formatAccountNumber = (accountNo: string): string => {
  if (!accountNo) return ''

  // 간단한 포맷팅 (실제로는 은행별로 다를 수 있음)
  if (accountNo.length > 8) {
    return accountNo.replace(/(\d{4})(\d{2})(\d+)/, '$1-$2-$3')
  }

  return accountNo
}
