import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BankingApp() {
  const [userType, setUserType] = useState('assembler');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // 유저 타입별 유저 ID 예시 (API 테스트용)
  const userIds = {
    assembler: 2, // 조립자 ID
    buyer: 1, // 구매자 ID
    corporation: 999, // 플랫폼 ID (예시)
  };

  // 금액 포맷 (숫자 -> 원화)
  const formatKRW = (amount) =>
    `\u20a9${Number(amount).toLocaleString('ko-KR')}`;

  // 유저 변경 시 잔액 및 거래내역 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: balanceData } = await axios.get(
          `/api/account/balance?userId=${userIds[userType]}`
        );
        const { data: txData } = await axios.get(
          `/api/account/transactions?userId=${userIds[userType]}`
        );

        setBalance(balanceData.balance);
        setTransactions(txData.transactions);
      } catch (err) {
        console.error('잔액 및 거래내역 불러오기 실패', err);
      }
    };

    fetchData();
  }, [userType]);

  return (
    <div className='min-h-screen bg-blue-50'>
      <div className='container mx-auto py-8 px-4'>
        <Card className='border-blue-200'>
          <CardHeader className='bg-blue-600 text-white'>
            <CardTitle className='text-2xl'>Banking Dashboard</CardTitle>
            <CardDescription className='text-blue-100'>
              Manage your finances with ease
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            {/* 유저 타입 선택 */}
            <div className='mb-8'>
              <h2 className='text-lg font-medium mb-4 text-blue-800'>
                유저 유형 선택
              </h2>
              <div className='flex flex-wrap gap-4'>
                <Button
                  variant={userType === 'assembler' ? 'default' : 'outline'}
                  onClick={() => setUserType('assembler')}
                  className={
                    userType === 'assembler'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-blue-300 text-blue-600'
                  }
                >
                  조립자
                </Button>
                <Button
                  variant={userType === 'buyer' ? 'default' : 'outline'}
                  onClick={() => setUserType('buyer')}
                  className={
                    userType === 'buyer'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-blue-300 text-blue-600'
                  }
                >
                  구매자
                </Button>
                <Button
                  variant={userType === 'corporation' ? 'default' : 'outline'}
                  onClick={() => setUserType('corporation')}
                  className={
                    userType === 'corporation'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-blue-300 text-blue-600'
                  }
                >
                  플랫폼
                </Button>
              </div>
            </div>

            {/* 잔액 표시 */}
            <div className='mb-8'>
              <h2 className='text-lg font-medium mb-4 text-blue-800'>
                현재 잔액
              </h2>
              <div className='bg-white rounded-lg p-6 border border-blue-200 shadow-sm'>
                <div className='flex items-center'>
                  <div className='bg-blue-100 p-3 rounded-full mr-4'>
                    <DollarSign className='h-8 w-8 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-blue-600 font-medium'>
                      사용 가능 금액
                    </p>
                    <p className='text-3xl font-bold text-blue-800'>
                      {formatKRW(balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 거래내역 표시 */}
            <div>
              <h2 className='text-lg font-medium mb-4 text-blue-800'>
                거래 내역
              </h2>
              <div className='bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-blue-50'>
                        <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                          날짜/시간
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                          이름
                        </th>
                        <th className='px-4 py-3 text-right text-sm font-medium text-blue-800'>
                          금액
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-blue-100'>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className='hover:bg-blue-50'>
                          <td className='px-4 py-3 text-sm text-gray-700'>
                            {tx.date}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-700'>
                            {tx.name}
                          </td>
                          <td className='px-4 py-3 text-sm text-right font-medium flex justify-end items-center'>
                            {tx.amount >= 0 ? (
                              <>
                                <ArrowDown className='h-4 w-4 text-green-500 mr-1' />
                                <span className='text-green-600'>
                                  +{formatKRW(tx.amount)}
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowUp className='h-4 w-4 text-red-500 mr-1' />
                                <span className='text-red-600'>
                                  -{formatKRW(Math.abs(tx.amount))}
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
