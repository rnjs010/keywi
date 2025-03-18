import { css, Global } from '@emotion/react'

import PretendardBold from '../fonts/Pretendard-SemiBold.woff'
import PretendardRegular from '../fonts/Pretendard-Regular.woff'

const customFonts = css`
  @font-face {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-display: swap; // FOUT와 동일하게 동작. fallback 폰트로 텍스트 먼저 보여주고, 로딩 완료시 폰트 적용
    src: url(${PretendardRegular}) format('woff');
  }
  @font-face {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url(${PretendardBold}) format('woff');
  }
  html {
    font-family: 'Pretendard';
  }
`

export default function Fonts() {
  return (
    <>
      <Global styles={customFonts} />
    </>
  )
}
