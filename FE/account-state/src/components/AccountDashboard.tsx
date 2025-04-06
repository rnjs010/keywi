import React, { useState, useEffect } from 'react';

type UserType = 'assembler' | 'buyer' | 'keywi';

interface Transaction {
  transactionDate: string;
  transactionTypeName: string;
  transactionBalance: string;
  transactionSummary: string;
}

interface AccountData {
  accountNo: string;
  accountBalance: string;
  transactions: Transaction[];
}

const dummyAccounts: Record<UserType, string> = {
  assembler: '001-1111-2222',
  buyer: '001-3333-4444',
  keywi: '001-5555-6666',
};

const AccountDashboard: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('assembler');
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAccountData = async (type: UserType) => {
    setLoading(true);

    // 실제로는 userType에 따라 다른 API 호출
    const accountNo = dummyAccounts[type];

    // 예시 API 호출 (백엔드 준비 시 교체)
    const res = await fetch(`/api/financial/account/${type}`);
    const data = await res.json();

    setAccount({
      accountNo: accountNo,
      accountBalance: data.rec.accountBalance,
      transactions: data.rec.list || [],
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAccountData(userType);
  }, [userType]);

  const handleRefresh = () => {
    fetchAccountData(userType);
  };

  return (
    <div className='p-4 max-w-2xl mx-auto border rounded-xl shadow'>
      <div className='flex gap-4 mb-4 justify-center'>
        <button
          onClick={() => setUserType('assembler')}
          className={`px-4 py-2 rounded ${
            userType === 'assembler' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          조립자
        </button>
        <button
          onClick={() => setUserType('buyer')}
          className={`px-4 py-2 rounded ${
            userType === 'buyer' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          구매자
        </button>
        <button
          onClick={() => setUserType('keywi')}
          className={`px-4 py-2 rounded ${
            userType === 'keywi' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          키위
        </button>
      </div>

      {loading ? (
        <p className='text-center'>불러오는 중...</p>
      ) : account ? (
        <div>
          <div className='mb-4'>
            <h2 className='text-lg font-bold'>계좌번호: {account.accountNo}</h2>
            <div className='flex items-center gap-2'>
              <span className='text-xl font-semibold'>
                잔액: ₩ {Number(account.accountBalance).toLocaleString()}
              </span>
              <button
                onClick={handleRefresh}
                className='bg-green-500 text-white px-2 py-1 rounded text-sm'
              >
                새로고침
              </button>
            </div>
          </div>

          <h3 className='text-md font-bold mb-2'>거래 내역</h3>
          <ul className='space-y-2'>
            {account.transactions.map((tx, idx) => (
              <li key={idx} className='border p-2 rounded'>
                <div className='text-sm'>{tx.transactionDate}</div>
                <div className='text-sm text-gray-500'>
                  {tx.transactionTypeName} - {tx.transactionBalance}원
                </div>
                <div className='text-sm'>{tx.transactionSummary}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>계좌 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default AccountDashboard;
