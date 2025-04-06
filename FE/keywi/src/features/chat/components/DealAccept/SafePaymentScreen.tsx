import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useDealAcceptStore } from '@/stores/ChatStore'
import { HelpCircle } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useState } from 'react'
import CommissionInfoModal from './CommissionInfoModal'

const PaymentContainer = tw.div`
  mx-4 my-2 p-4 bg-pay rounded-lg
`

const PaymentSection = tw.div`
  flex flex-col gap-2 py-4 mb-4 border-b border-littleGray
`

const PaymentRow = tw.div`
  flex flex-row justify-between items-center
`

// 수수료 계산 함수
const calculateCommission = (total: number) => {
  return Math.round(total * 0.01)
}

export default function SafePaymentScreen() {
  const setStep = useDealAcceptStore((state) => state.setStep)
  const totalPrice = useDealAcceptStore((state) => state.totalPrice)
  const commission = calculateCommission(totalPrice)
  const finalAmount = totalPrice + commission

  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleNext = () => {
    setStep(3)
  }

  return (
    <>
      {/* 결제 금액 */}
      <PaymentContainer>
        <Text variant="body2" weight="bold" color="black">
          결제금액
        </Text>
        <PaymentSection>
          <PaymentRow>
            <Text variant="caption1" weight="regular" color="darkGray">
              거래금액
            </Text>
            <Text variant="caption1" weight="bold" color="darkGray">
              {totalPrice.toLocaleString()}원
            </Text>
          </PaymentRow>
          <PaymentRow>
            <div className="flex flex-row items-center gap-1">
              <Text variant="caption1" weight="regular" color="darkGray">
                안심결제 수수료
              </Text>
              <HelpCircle
                height="1rem"
                width="1rem"
                color={colors.darkGray}
                onClick={handleOpenModal}
              />
            </div>
            <Text variant="caption1" weight="bold" color="darkGray">
              {commission.toLocaleString()}원
            </Text>
          </PaymentRow>
        </PaymentSection>

        <PaymentRow>
          <Text variant="caption1" weight="regular" color="darkGray">
            최종 결제 금액
          </Text>
          <Text variant="caption1" weight="bold" color="darkGray">
            {finalAmount.toLocaleString()}원
          </Text>
        </PaymentRow>
      </PaymentContainer>

      {/* 결제 수단 */}
      <PaymentContainer>
        <Text variant="body2" weight="bold" color="black">
          결제수단
        </Text>
        <PaymentRow className="pt-4">
          <Text variant="caption1" weight="regular" color="darkGray">
            키위페이 연결계좌
          </Text>
          <Text variant="caption1" weight="bold" color="darkGray">
            우리은행 2304
          </Text>
        </PaymentRow>
      </PaymentContainer>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-8 px-4">
        <MainButton text="물품 받고 돈 전달하기" onClick={handleNext} />
      </div>

      <CommissionInfoModal isOpen={openModal} onOpenChange={setOpenModal} />
    </>
  )
}
